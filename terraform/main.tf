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
# # authenticator
# ################################################################################
module "authenticator" {
  source = "./modules/authenticator"
  prefix = "${local.prefix}-authenticator"
}

# ################################################################################
# # crawler
# ################################################################################
module "crawler" {
  source                  = "./modules/crawler"
  prefix                  = "${local.prefix}-crawler"
  source_dir              = "./function/crawler"
  authenticator_table_id  = module.authenticator.table_id
  authenticator_table_arn = module.authenticator.table_arn
  parser_queue_arn        = module.parser.queue_arn
  parser_queue_url        = module.parser.queue_url
  stream_enabled          = true
}

# ################################################################################
# # parser
# ################################################################################
module "parser" {
  source     = "./modules/parser"
  prefix     = "${local.prefix}-parser"
  source_dir = "./function/parser"
  # moderator_queue_arn = module.moderator.queue_arn
  # moderator_queue_url = module.moderator.queue_url
  moderator_queue_arn = module.moderator_go.queue_arn
  moderator_queue_url = module.moderator_go.queue_url
  stream_enabled      = true
}

# ################################################################################
# # moderator
# ################################################################################
module "moderator" {
  source         = "./modules/moderator"
  prefix         = "${local.prefix}-moderator"
  source_dir     = "./function/moderator"
  stream_enabled = true
}

module "moderator_go" {
  source         = "./modules/moderator-go"
  prefix         = "${local.prefix}-moderator-go"
  source_dir     = "./function/moderator-go"
  stream_enabled = true
}
