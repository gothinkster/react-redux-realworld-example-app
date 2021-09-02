variable "region" {
  type        = string
  description = "AWS Region"
  default     = "eu-west-1"
}

variable "account_id" {
  type        = string
  description = "AWS Account ID"
}

variable "profile" {
  type        = string
  description = "AWS Profile in .credentials"
  default     = "default"
}

variable "environment" {
  type        = string
  description = "Application environment"
}

variable "bucket_name" {
  type = string
}