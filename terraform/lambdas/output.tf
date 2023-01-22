output "invoke_arn" {
  value = aws_lambda_function.recommender.invoke_arn
}
output "function_name" {
  value = aws_lambda_function.recommender.function_name
}