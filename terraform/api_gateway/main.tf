locals {
  process_name = "champswaps"
}
resource "aws_api_gateway_rest_api" "champswaps" {
  name        = var.apigw_name
  description = var.apigw_description
}

resource "aws_api_gateway_resource" "resource" {
  parent_id   = aws_api_gateway_rest_api.champswaps.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.champswaps.id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "method" {
  rest_api_id      = aws_api_gateway_rest_api.champswaps.id
  resource_id      = aws_api_gateway_resource.resource.id
  http_method      = var.apigw_http_method
  authorization    = "NONE"
  api_key_required = true
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id = aws_api_gateway_rest_api.champswaps.id
  resource_id = aws_api_gateway_resource.resource.id
  http_method = aws_api_gateway_method.method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.invoke_lambda_arn
}

resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.champswaps.id
  stage_name  = var.environment_name

  depends_on = [
    aws_api_gateway_integration.integration,
  ]
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.resource.id,
      aws_api_gateway_method.method.id,
      aws_api_gateway_integration.integration.id,
    ]))
  }
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_rest_api.champswaps.execution_arn}/*/*"
}

# API KEY
resource "aws_api_gateway_api_key" "api_key" {
  name  = "${local.process_name}_api_key"
  value = var.api_key
}
resource "aws_api_gateway_usage_plan" "usage_plan" {
  name = "usage_${local.process_name}"
  api_stages {
    api_id = aws_api_gateway_rest_api.champswaps.id
    stage  = aws_api_gateway_deployment.deployment.stage_name
  }
}
resource "aws_api_gateway_usage_plan_key" "usage_plan_key" {
  key_id        = aws_api_gateway_api_key.api_key.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.usage_plan.id
}
