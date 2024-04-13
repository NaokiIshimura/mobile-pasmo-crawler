variable "prefix" {
  description = "システム名称-ワークスペース名称-コンポーネント名称"
  type        = string
}

variable "table_arn" {
  description = "dynamoDBテーブルのARN"
  type        = string
}

variable "table_id" {
  description = "dynamoDBテーブルのID"
  type        = string
}
