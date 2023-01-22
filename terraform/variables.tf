variable "high_entropy_api_key" {
  type        = string
  description = "a high entropy key for API Gateway Security"
}
variable "environment_name" {
  type        = string
  description = "for the API gateway stage"
}
variable "riot_api_key" {
  type        = string
  description = "a RIOT API development/prod key. https://developer.riotgames.com/"
}
variable "recommender_mode" {
  type        = string
  description = "Any of the supported modes. See README.md for more info"
}
variable "riot_get_summoner_info_url" {
  type        = string
  description = "The RIOT API used to get encrypted summoner info. Requires a valid RIOT API KEY"
}
variable "riot_get_summoner_masteries_url" {
  type        = string
  description = "The RIOT API used to get a Summoner Champion Masteries. Requires encrypted summoner info. Requires a valid RIOT API KEY"
}