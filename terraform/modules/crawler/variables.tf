variable "prefix" {
  description = "システム名称-ワークスペース名称-コンポーネント名称"
  type        = string
}

variable "source_dir" {
  description = "ソースディレクトリ"
  type        = string
}

variable "authenticator_table_id" {
  description = "authenticatorテーブルID"
  type        = string
}

variable "authenticator_table_arn" {
  description = "authenticatorテーブルARN"
  type        = string
}

variable "parser_queue_arn" {
  description = "parserSQSキューARN"
  type        = string
}


variable "parser_queue_url" {
  description = "parserSQSキューURL"
  type        = string
}

variable "stream_enabled" {
  description = "dynamoDB Stream 有効"
  type        = bool
}
