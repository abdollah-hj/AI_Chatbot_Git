# AWS Deployment Guide for AI Chat Assistant

This guide will walk you through deploying the AI Chat Assistant application to AWS using different services.

## Option 1: AWS Elastic Beanstalk (Simplest)

### Prerequisites
- AWS Account
- AWS CLI installed and configured
- EB CLI installed (`pip install awsebcli`)

### Steps

1. **Initialize Elastic Beanstalk**:
   ```bash
   eb init
   ```
   - Select your region
   - Create a new application or select existing
   - Select Node.js platform
   - Set up SSH for instance access (optional)

2. **Create and Deploy**:
   ```bash
   eb create ai-chat-assistant-env
   ```

3. **For future updates**:
   ```bash
   eb deploy
   ```

4. **Open the application**:
   ```bash
   eb open
   ```

## Option 2: AWS EC2 with Docker

### Prerequisites
- AWS Account
- AWS CLI installed and configured

### Steps

1. **Launch an EC2 instance**:
   - Use Amazon Linux 2 AMI
   - t2.micro for testing, t2.small or larger for production
   - Configure security group to allow HTTP (80), HTTPS (443), and SSH (22)

2. **Connect to your instance**:
   ```bash
   ssh -i your-key.pem ec2-user@your-instance-public-dns
   ```

3. **Install Docker**:
   ```bash
   sudo yum update -y
   sudo amazon-linux-extras install docker
   sudo service docker start
   sudo systemctl enable docker
   sudo usermod -a -G docker ec2-user
   ```
   (Log out and log back in)

4. **Clone your repository or upload your files**:
   ```bash
   git clone <your-repo-url>
   # OR upload files using SCP
   ```

5. **Build and run Docker container**:
   ```bash
   docker build -t ai-chat-assistant .
   docker run -d -p 80:3000 ai-chat-assistant
   ```

## Option 3: AWS App Runner (Fully Managed)

1. **Push your Docker image to Amazon ECR**:
   ```bash
   aws ecr create-repository --repository-name ai-chat-assistant
   aws ecr get-login-password | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.<region>.amazonaws.com
   docker build -t ai-chat-assistant .
   docker tag ai-chat-assistant:latest <your-account-id>.dkr.ecr.<region>.amazonaws.com/ai-chat-assistant:latest
   docker push <your-account-id>.dkr.ecr.<region>.amazonaws.com/ai-chat-assistant:latest
   ```

2. **Create an App Runner service**:
   - Go to AWS App Runner console
   - Create a new service
   - Select "Container registry" as source
   - Choose your ECR repository and image
   - Configure service settings (name, CPU, memory)
   - Configure networking (public endpoint)
   - Create and deploy

## Option 4: AWS Amplify (for Static Frontend + API Gateway + Lambda for Backend)

This is a good option if you want to separate your frontend and backend:

1. **Deploy frontend to Amplify**:
   - Connect your Git repository to AWS Amplify
   - Configure build settings
   - Deploy

2. **Deploy backend to Lambda + API Gateway**:
   - Modify server.js to work as a Lambda function
   - Create API Gateway endpoints
   - Connect frontend to API Gateway endpoints

## Considerations

- **Database**: If you need a database, consider using Amazon RDS or DynamoDB
- **Domain Name**: Use Route 53 to manage your domain
- **SSL/TLS**: Use AWS Certificate Manager for HTTPS
- **CDN**: Use CloudFront to distribute content globally
- **Monitoring**: Set up CloudWatch for monitoring and alerts

## Cost Optimization

- Elastic Beanstalk with t2.micro instances is eligible for AWS Free Tier
- EC2 t2.micro instances are eligible for AWS Free Tier
- Consider using Auto Scaling to scale based on demand
- Use CloudFront to reduce data transfer costs

## Security Best Practices

- Use IAM roles with least privilege
- Enable AWS WAF for web application firewall protection
- Store sensitive information in AWS Secrets Manager
- Enable CloudTrail for auditing
- Implement network security with security groups and NACLs 