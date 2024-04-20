variable "prefix" {
  description = "システム名称-ワークスペース名称-コンポーネント名称"
  type        = string
}

variable "source_dir" {
  description = "ソースディレクトリ"
  type        = string
}

variable "moderator_queue_arn" {
  description = "moderatorSQSキューARN"
  type        = string
}

variable "moderator_queue_url" {
  description = "moderatorSQSキューURL"
  type        = string
}

variable "stream_enabled" {
  description = "dynamoDB Stream 有効"
  type        = bool
}
