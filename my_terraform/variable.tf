variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}


variable "db_username" {
  description = "Master username for RDS"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "Master password for RDS"
  type        = string
  sensitive   = true
}

variable "ec2_key_name" {
  description = "Name of the existing key pair for SSH"
  type        = string
  default     = "app_tier_keypair"
}

variable "ami_id" {
  description = "AMI ID for Ubuntu 22.04"
  type        = string
  default     = "ami-0fc5d935ebf8bc3bc"
}