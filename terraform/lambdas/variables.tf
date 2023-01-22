variable "env_vars" {
  type        = map(string)
  default     = {}
  description = "The set of Name/Key values to inject to lambda"
}