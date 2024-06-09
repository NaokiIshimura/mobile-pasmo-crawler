output "table_arn" {
  value = aws_dynamodb_table.main.arn
}

output "table_id" {
  value = aws_dynamodb_table.main.id
}

output "api_endpoint" {
  description = "API Gatewayのエンドポイント"
  value       = aws_apigatewayv2_api.main.api_endpoint
}
