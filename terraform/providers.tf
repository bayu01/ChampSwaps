terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "2.3.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  profile = "free-tier"
}
provider "archive" {
  # Configuration options
}

