module "frontend_s3_cf" {
  source      = "./modules/s3cf"

  bucket_name = var.bucket_name
  environment = var.environment
}

resource "aws_s3_bucket" "artifacts" {
  bucket = "artifacts-${var.bucket_name}-${var.environment}"
}