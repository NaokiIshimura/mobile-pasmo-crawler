variable "prefix" {
  description = "システム名称-ワークスペース名称-コンポーネント名称"
  type        = string
}

variable "auth_token" {
  description = "認証トークン"
  type        = string
}

variable "allow_ip_address" {
  description = "アクセス許可するIPアドレス"
  type        = string
}
