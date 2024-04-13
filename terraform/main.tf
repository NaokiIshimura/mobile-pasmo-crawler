terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.17"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "ap-northeast-1"
}

locals {
  # 「mpc」は「mobile-pasmo-crawler」の略
  prefix = "mpc-${terraform.workspace}"
}


# ################################################################################
# # crawler
# ################################################################################
module "dynamodb" {
  source = "./modules/dynamodb"
  prefix = "${local.prefix}-crawler"
}

module "lambda" {
  source    = "./modules/lambda"
  prefix    = "${local.prefix}-crawler"
  table_arn = module.dynamodb.table_arn
  table_id  = module.dynamodb.table_id
}
