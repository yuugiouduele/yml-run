terraform {
  required_version = ">= 1.0"

  backend "s3" {
    bucket         = "your-terraform-state-bucket"      # ここを適切なS3バケット名に変更してください
    key            = "path/to/terraform.tfstate"        # 状態ファイルのS3内のパス
    region         = "ap-northeast-1"                    # リージョン
    encrypt        = true                                # 暗号化有効
    dynamodb_table = "terraform-lock-table"              # ロック用DynamoDBテーブル名
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-1"

  # OIDCを利用しGitHub Actions等から安全に権限設定するための設定例
  # GitHub Actions用のOIDCプロバイダを設定し、AssumeRoleのAWS認証を利用
  # OIDC対応が不要なら以下の assume_role ブロックを削除してください

  assume_role {
    role_arn = "arn:aws:iam::123456789012:role/github-actions-deploy-role"  # 事前にIAM Roleを作成しておく
    session_name = "github-actions-session"
  }
}

# 以下はAWSの基本リソース例
# 必要に応じて用途に合わせて追加してください

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "main-vpc"
  }
}

resource "aws_subnet" "main" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "ap-northeast-1a"

  tags = {
    Name = "main-subnet"
  }
}

resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh"
  description = "Allow SSH inbound traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH from anywhere"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_ssh_sg"
  }
}

resource "aws_instance" "example" {
  ami           = "ami-0abcdef1234567890"   # 実際に利用可能なAMIに置き換えてください
  instance_type = "t3.micro"
  subnet_id     = aws_subnet.main.id
  security_groups = [aws_security_group.allow_ssh.name]

  tags = {
    Name = "example-instance"
  }
}

# Outputs
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "instance_public_ip" {
  description = "Public IP of the EC2 Instance"
  value       = aws_instance.example.public_ip
}
