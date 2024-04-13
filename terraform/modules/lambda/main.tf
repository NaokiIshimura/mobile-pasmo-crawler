################################################################################
# Lambda
################################################################################

########################################
# Lambda Function
########################################
resource "aws_lambda_function" "crawler" {
  filename      = data.archive_file.crawler.output_path
  function_name = "${var.prefix}-function"
  role          = aws_iam_role.crawler.arn
  handler       = "lambda.handler"
  runtime       = "nodejs20.x"

  source_code_hash = data.archive_file.crawler.output_base64sha256

  timeout = 60
  // https://github.com/shelfio/chrome-aws-lambda-layer
  layers      = ["arn:aws:lambda:ap-northeast-1:764866452798:layer:chrome-aws-lambda:44"]
  memory_size = 1600

  environment {
    variables = {
      TABLE_NAME = var.table_id
    }
  }
}

data "archive_file" "crawler" {
  type        = "zip"
  source_dir  = "function"
  output_path = "archives/${var.prefix}.zip"
}

########################################
# IAM Role for Lambda
########################################

# Lambda実行用IAMロール
resource "aws_iam_role" "crawler" {
  name               = "${var.prefix}-role"
  assume_role_policy = data.aws_iam_policy_document.crawler_assume.json
}


// Assumeロール
data "aws_iam_policy_document" "crawler_assume" {
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
resource "aws_iam_role_policy_attachment" "crawler" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.crawler.name
}

// Lambda実行用IAMロールに、ポリシーをアタッチ
resource "aws_iam_role_policy" "crawler" {
  name   = "${var.prefix}-lambda-policy"
  role   = aws_iam_role.crawler.id
  policy = data.aws_iam_policy_document.crawler.json
}

# Lambda実行用IAMポリシー
data "aws_iam_policy_document" "crawler" {

  # DynamoDB
  statement {
    actions = [
      "dynamodb:*",
    ]
    resources = [
      var.table_arn
    ]
  }
}
