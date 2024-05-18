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
