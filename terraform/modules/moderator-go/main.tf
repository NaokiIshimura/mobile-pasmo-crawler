################################################################################
# SQS
################################################################################

########################################
# SQS Queue
########################################

# キュー
resource "aws_sqs_queue" "main" {
  name = "${var.prefix}-queue"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = 10
  })
}

########################################
# SQS Dead Letter Queue
########################################

# デッドレターキュー
resource "aws_sqs_queue" "dlq" {
  name = "${var.prefix}-dlq"
}

# 再実行許可ポリシー
resource "aws_sqs_queue_redrive_allow_policy" "main_queue_redrive_allow_policy" {
  queue_url = aws_sqs_queue.dlq.id

  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue",
    sourceQueueArns   = [aws_sqs_queue.main.arn]
  })
}

########################################
# SQS -> Lambda
# https://zenn.dev/voicy/articles/e8368c299d1de0
########################################
resource "aws_lambda_event_source_mapping" "main" {
  // バッチサイズ: 一度に処理する最大レコード数
  batch_size = 1
  // バッチウィンドウ: ここで設定した秒数が経過したらバッチサイズまでレコード数が貯まらなくても実行する
  # maximum_batching_window_in_seconds = 5
  // SQSのARN (S3やSNSといったSQS以外のリソースをイベントソースにしたい場合はそれらのARN)
  event_source_arn = aws_sqs_queue.main.arn
  // LambdaのARN (function_nameというパラメータだけどARNを渡します)
  function_name = aws_lambda_function.main.arn
}

################################################################################
# Lambda
################################################################################

########################################
# Lambda Function
########################################
# function
resource "aws_lambda_function" "main" {
  filename      = data.archive_file.main.output_path
  function_name = "${var.prefix}-function"
  role          = aws_iam_role.main.arn
  handler       = "lambda.handler"
  runtime       = "provided.al2"
  architectures = ["arm64"]

  source_code_hash = data.archive_file.main.output_base64sha256

  timeout = 10

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.main.id
      TABLE_NAME  = aws_dynamodb_table.main.id
    }
  }
}

resource "null_resource" "main" {
  triggers = {
    always_run = timestamp()
  }
  provisioner "local-exec" {
    command = "cd ./function/moderator-go/main/ && GOOS=linux go build -o bootstrap"
  }
}

data "archive_file" "main" {
  type        = "zip"
  source_dir  = "${var.source_dir}/main"
  output_path = "archives/${var.prefix}-main.zip"
  depends_on  = [null_resource.main]
}

# stream
resource "aws_lambda_function" "stream" {
  filename      = data.archive_file.stream.output_path
  function_name = "${var.prefix}-stream"
  role          = aws_iam_role.main.arn
  handler       = "stream.handler"
  runtime       = "provided.al2"
  architectures = ["arm64"]

  source_code_hash = data.archive_file.stream.output_base64sha256
}

resource "null_resource" "stream" {
  triggers = {
    always_run = timestamp()
  }
  provisioner "local-exec" {
    command = "cd ./function/moderator-go/stream/ && GOOS=linux go build -o bootstrap"
  }
}


data "archive_file" "stream" {
  type        = "zip"
  source_dir  = "${var.source_dir}/stream"
  output_path = "archives/${var.prefix}-stream.zip"
  depends_on  = [null_resource.stream]
}

########################################
# IAM Role for Lambda
########################################

# Lambda実行用IAMロール
resource "aws_iam_role" "main" {
  name               = "${var.prefix}-role"
  assume_role_policy = data.aws_iam_policy_document.main_assume.json
}


// Assumeロール
data "aws_iam_policy_document" "main_assume" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }

}

// Lambda実行用IAMロールに、AWSLambdaBasicExecutionRoleをアタッチ
resource "aws_iam_role_policy_attachment" "main" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.main.name
}

// Lambda実行用IAMロールに、ポリシーをアタッチ
resource "aws_iam_role_policy" "main" {
  name   = "${var.prefix}-lambda-policy"
  role   = aws_iam_role.main.id
  policy = data.aws_iam_policy_document.main.json
}

# Lambda実行用IAMポリシー
data "aws_iam_policy_document" "main" {

  # SQS
  statement {
    actions = [
      "sqs:*",
    ]
    resources = [
      aws_sqs_queue.main.arn,
    ]
  }

  # S3
  statement {
    actions = [
      "s3:*",
    ]
    resources = [
      "${aws_s3_bucket.main.arn}",
      "${aws_s3_bucket.main.arn}/*",
    ]
  }

  # DynamoDB
  statement {
    actions = [
      "dynamodb:*",
    ]
    resources = [
      aws_dynamodb_table.main.arn,
      "${aws_dynamodb_table.main.arn}/*",
    ]
  }

}

################################################################################
# S3
################################################################################

########################################
# S3 Bucket
########################################

resource "aws_s3_bucket" "main" {
  bucket = "${var.prefix}-bucket"
}

################################################################################
# DynamoDB
################################################################################

########################################
# DynamoDB Table
########################################

resource "aws_dynamodb_table" "main" {
  name             = "${var.prefix}-table"
  billing_mode     = "PAY_PER_REQUEST"
  hash_key         = "id"
  range_key        = "dataType"
  stream_enabled   = var.stream_enabled
  stream_view_type = "NEW_IMAGE"

  point_in_time_recovery {
    enabled = true
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "dataType"
    type = "S"
  }
}

########################################
# DynamoDB Stream -> Lambda
########################################
resource "aws_lambda_event_source_mapping" "stream" {
  count             = var.stream_enabled ? 1 : 0
  event_source_arn  = aws_dynamodb_table.main.stream_arn
  function_name     = aws_lambda_function.stream.arn
  starting_position = "LATEST"
}
