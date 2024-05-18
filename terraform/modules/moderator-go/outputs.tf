output "function_arn" {
  value = aws_lambda_function.main.arn
}

output "bucket_arn" {
  value = aws_s3_bucket.main.arn
}

output "bucket_id" {
  value = aws_s3_bucket.main.id
}

output "queue_arn" {
  value = aws_sqs_queue.main.arn
}

output "queue_url" {
  value = aws_sqs_queue.main.url
}
