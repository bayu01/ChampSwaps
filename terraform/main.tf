module "lambda" {
  source = "./lambdas"
  env_vars = {
    "RIOT_API_KEY"                    = var.riot_api_key
    "RECOMMENDER_MODE"                = var.recommender_mode
    "RIOT_GET_SUMMONER_INFO_URL"      = var.riot_get_summoner_info_url
    "RIOT_GET_SUMMONER_MASTERIES_URL" = var.riot_get_summoner_masteries_url
  }
}

module "api_gateway" {
  source               = "./api_gateway"
  apigw_name           = "ChampSwapsAPIGateway"
  apigw_description    = "Provides an endpoint for the ChampSwap recommender"
  apigw_http_method    = "POST"
  api_key              = var.high_entropy_api_key
  environment_name     = var.environment_name
  invoke_lambda_arn    = module.lambda.invoke_arn
  lambda_function_name = module.lambda.function_name
}