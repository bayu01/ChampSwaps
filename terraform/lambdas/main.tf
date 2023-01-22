locals {
  process_name     = "recommender"
  lambda_directory = "${path.module}/${local.process_name}"
  temp_file_name   = "${path.module}/.terraform/archive_files/${local.process_name}.zip"
}

# Archive lambda function
data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = local.lambda_directory
  output_path = local.temp_file_name
  depends_on  = [null_resource.npm_install]
}

resource "aws_lambda_function" "recommender" {
  filename         = local.temp_file_name
  function_name    = local.process_name
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  source_code_hash = data.archive_file.lambda.output_base64sha256
  timeout          = 10
  memory_size      = 256
  environment {
    variables = var.env_vars
  }
}

# Provisioner to install dependencies in lambda package before upload it.
resource "null_resource" "npm_install" {
  triggers = {
    updated_at = timestamp()
  }
  provisioner "local-exec" {
    command     = "npm i"
    working_dir = local.lambda_directory
  }
}

resource "aws_iam_role" "lambda_role" {
  name               = "${local.process_name}_role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_policy.json
  inline_policy {
    name   = "basic-policy"
    policy = data.aws_iam_policy_document.basic_lambda_policy.json
  }
}

data "aws_iam_policy_document" "lambda_assume_role_policy" {
  statement {
    sid     = ""
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "basic_lambda_policy" {
  statement {
    sid    = "1"
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["*"]
  }
}