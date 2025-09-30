provider "aws" {
  region = "us-east-1"
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnet" "public_us_east_1a" {
  filter {
    name   = "availability-zone"
    values = ["us-east-1a"]
  }

  filter {
    name   = "default-for-az"
    values = ["true"]
  }
}

data "aws_key_pair" "cuong" {
  key_name = "cuong-aws-us-east"
}

data "aws_ami" "deep_learning" {
  most_recent = true

  filter {
    name   = "name"
    values = ["Deep Learning Base OSS Nvidia Driver GPU AMI (Amazon Linux 2023)*"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["amazon"]
}

resource "aws_security_group" "app_server" {
  name        = "app-server-sg"
  description = "Allow SSH and web access from the internet"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description      = "Allow SSH"
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    description      = "Allow HTTP"
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    description      = "Allow HTTPS"
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "app-server-sg"
  }
}
variable "ssh_public_key" {
  description = "SSH public key for damsan user"
  type        = string
  # You can set this via environment variable or terraform.tfvars
}

resource "aws_instance" "app_server" {
  ami           = data.aws_ami.deep_learning.id
  instance_type = "g4dn.xlarge"
  subnet_id     = data.aws_subnet.public_us_east_1a.id
  vpc_security_group_ids = [aws_security_group.app_server.id]
  associate_public_ip_address = true
  key_name                    = "cuong-aws-us-east"

  root_block_device {
    volume_size = 200
    volume_type = "gp3"
  }

  user_data = <<-EOT
  #cloud-config
  users:
    - default
    - name: damsan
      shell: /bin/bash
      groups:
        - wheel
      sudo: "ALL=(ALL) NOPASSWD:ALL"
      ssh_authorized_keys:
        - ${var.ssh_public_key}
  EOT

  tags = {
    Name = "damsan-server"
  }
}
