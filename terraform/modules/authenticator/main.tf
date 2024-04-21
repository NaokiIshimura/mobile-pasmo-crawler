################################################################################
# DynamoDB
################################################################################

########################################
# DynamoDB Table
########################################

resource "aws_dynamodb_table" "main" {
  name           = "${var.prefix}-table"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "id"
  range_key      = "dataType"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "dataType"
    type = "S"
  }
}
