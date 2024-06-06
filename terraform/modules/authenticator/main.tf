################################################################################
# DynamoDB
################################################################################

########################################
# DynamoDB Table
########################################

resource "aws_dynamodb_table" "main" {
  name         = "${var.prefix}-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "dataType"

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

################################################################################
# Lambda
################################################################################
data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

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
      TABLE_NAME = aws_dynamodb_table.main.name
    }
  }
}

resource "null_resource" "main" {
  triggers = {
    always_run = timestamp()
  }
  provisioner "local-exec" {
    command = "cd ../api && GOOS=linux go build -o bootstrap"
  }
}

data "archive_file" "main" {
  type        = "zip"
  source_dir  = "../api"
  output_path = "archives/${var.prefix}-app.zip"
  depends_on  = [null_resource.main]
}


########################################
# IAM Role for Lambda
########################################

# Lambda実行用IAMロール
resource "aws_iam_role" "main" {
  name               = "${var.prefix}-role"
  assume_role_policy = data.aws_iam_policy_document.assume.json
}

// Assumeロール
data "aws_iam_policy_document" "assume" {
  statement {
    actions = [
      "sts:AssumeRole",
    ]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
    effect = "Allow"
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

  # DynamoDB
  statement {
    actions = [
      "dynamodb:*",
    ]
    resources = [
      aws_dynamodb_table.main.arn,
    ]
  }

}

################################################################################
# API Gateway
################################################################################
resource "aws_apigatewayv2_api" "main" {
  name          = "${var.prefix}-api"
  protocol_type = "HTTP"
  target        = aws_lambda_function.main.arn

  # cors_configuration {
  #   allow_methods = ["GET", "POST", "OPTIONS"]
  #   allow_origins = ["http://localhost:3000"]
  #   allow_headers = ["Authorization", "Content-Type", "application/json"]
  # }
}

resource "aws_lambda_permission" "main" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.main.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}


########################################
# IP制限
########################################
# IAMロールの作成
resource "aws_iam_role" "lambda_role" {
  name = "lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
    }],
  })
}

// IAMをアタッチ
resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda関数の作成
resource "aws_lambda_function" "ip_restrict_lambda" {
  filename      = data.archive_file.authorizer.output_path
  function_name = "${var.prefix}-authorizer"
  role          = aws_iam_role.lambda_role.arn
  handler       = "authorizer.handler"
  runtime       = "nodejs20.x"

  source_code_hash = data.archive_file.authorizer.output_base64sha256

  environment {
    variables = {
      AUTH_TOKEN       = var.auth_token
      ALLOW_IP_ADDRESS = var.allow_ip_address
    }
  }
}

data "archive_file" "authorizer" {
  type        = "zip"
  source_dir  = "function/authenticator"
  output_path = "archives/${var.prefix}-authorizer.zip"
}

# Lambdaオーソライザーの作成
resource "aws_apigatewayv2_authorizer" "main" {
  api_id                            = aws_apigatewayv2_api.main.id
  authorizer_type                   = "REQUEST"
  authorizer_payload_format_version = "2.0"
  name                              = "${var.prefix}-authorizer"
  authorizer_uri                    = aws_lambda_function.ip_restrict_lambda.invoke_arn
  authorizer_result_ttl_in_seconds  = 0
  # identity_sourcesについて、
  # 普通は「$request.header.Authorization"」などを指定する
  # 今回のユースケースでは認証は行わないので不要だが、必須パラメータなのでリクエストに含まれてる値を指定
  # (identity_sourcesで指定してるパラメータがリクエストに無いと、authorizerが呼ばれないので注意)
  # 参考
  # identity_sources = ["$context.identity.sourceIp", "$context.path", "$context.protocol", 
  #                     "$request.header.origin", "$request.header.user-agent", "$request.header.authorization"]
  identity_sources = ["$request.header.host"]

  # オーソライザーを作成したあと、ルートに紐づける
  # （quick_createの場合、ルートのリソースが自動的に作成されて、ルートにオーソライザーを紐づけることができないため、コマンドを実行させて紐づける）
  provisioner "local-exec" {
    on_failure = continue
    command    = <<EOT
      RouteId=$(aws apigatewayv2 get-routes --api-id ${aws_apigatewayv2_api.main.id} | jq -r '.Items[0].RouteId')
      aws apigatewayv2 update-route --api-id ${aws_apigatewayv2_api.main.id} --route-id $RouteId --authorization-type CUSTOM --authorizer-id ${aws_apigatewayv2_authorizer.main.id}
    EOT
  }
}
