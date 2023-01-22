variable "environment_name" {
  type        = string
  description = "used for construction of deployment"
}
variable "apigw_name" {
  type        = string
  description = "the name of the lambda function to execute"
}
variable "apigw_description" {
  type        = string
  description = "description for the API Gateway"
}
variable "apigw_http_method" {
  type        = string
  description = "description for the API Gateway"
}
variable "api_key" {
  type        = string
  description = "a high entropy API key to secure the created API"
}
variable "invoke_lambda_arn" {
  type        = string
  description = "the invoke arn of a lambda to invoke"
}
variable "lambda_function_name" {
  type        = string
  description = "the name of the lambda function to execute"
}