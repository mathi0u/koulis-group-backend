#!/bin/bash

# Cloud deployment script for various cloud providers
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_usage() {
    echo -e "${BLUE}Usage: $0 [PROVIDER]${NC}"
    echo -e "${BLUE}Providers:${NC}"
    echo -e "  ${GREEN}docker${NC}     - Deploy using Docker Compose (local/VPS)"
    echo -e "  ${GREEN}aws${NC}       - Deploy to AWS ECS (requires AWS CLI)"
    echo -e "  ${GREEN}gcp${NC}       - Deploy to Google Cloud Run (requires gcloud CLI)"
    echo -e "  ${GREEN}azure${NC}     - Deploy to Azure Container Instances (requires Azure CLI)"
    echo -e "  ${GREEN}digitalocean${NC} - Deploy to DigitalOcean App Platform"
    echo -e "  ${GREEN}heroku${NC}    - Deploy to Heroku (requires Heroku CLI)"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  $0 docker"
    echo -e "  $0 aws"
    echo -e "  $0 gcp"
}

PROVIDER=${1:-docker}

case $PROVIDER in
    docker)
        echo -e "${GREEN}🚀 Deploying with Docker Compose...${NC}"
        ./deploy.sh
        ;;
        
    aws)
        echo -e "${GREEN}🚀 Preparing for AWS ECS deployment...${NC}"
        
        # Check if AWS CLI is installed
        if ! command -v aws &> /dev/null; then
            echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
            exit 1
        fi
        
        echo -e "${YELLOW}📝 Building and pushing to ECR...${NC}"
        
        # You'll need to set these variables
        AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-"your-account-id"}
        AWS_REGION=${AWS_REGION:-"us-east-1"}
        ECR_REPOSITORY=${ECR_REPOSITORY:-"k-group-back"}
        
        # Build and tag image
        docker build -t $ECR_REPOSITORY:latest .
        docker tag $ECR_REPOSITORY:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest
        
        # Login to ECR and push
        aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
        docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest
        
        echo -e "${GREEN}✅ Image pushed to ECR!${NC}"
        echo -e "${YELLOW}💡 Next steps:${NC}"
        echo -e "1. Create an ECS cluster"
        echo -e "2. Create a task definition using the ECR image"
        echo -e "3. Create an RDS PostgreSQL instance"
        echo -e "4. Set up environment variables in ECS"
        echo -e "5. Create and run the ECS service"
        ;;
        
    gcp)
        echo -e "${GREEN}🚀 Preparing for Google Cloud Run deployment...${NC}"
        
        # Check if gcloud CLI is installed
        if ! command -v gcloud &> /dev/null; then
            echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
            exit 1
        fi
        
        PROJECT_ID=${GCP_PROJECT_ID:-"your-project-id"}
        SERVICE_NAME=${GCP_SERVICE_NAME:-"k-group-back"}
        REGION=${GCP_REGION:-"us-central1"}
        
        echo -e "${YELLOW}📝 Building and deploying to Cloud Run...${NC}"
        
        gcloud run deploy $SERVICE_NAME \
            --source . \
            --platform managed \
            --region $REGION \
            --allow-unauthenticated \
            --project $PROJECT_ID
            
        echo -e "${GREEN}✅ Deployed to Cloud Run!${NC}"
        echo -e "${YELLOW}💡 Don't forget to:${NC}"
        echo -e "1. Set up Cloud SQL PostgreSQL instance"
        echo -e "2. Configure environment variables in Cloud Run"
        echo -e "3. Set up VPC connector if needed"
        ;;
        
    azure)
        echo -e "${GREEN}🚀 Preparing for Azure Container Instances deployment...${NC}"
        
        # Check if Azure CLI is installed
        if ! command -v az &> /dev/null; then
            echo -e "${RED}❌ Azure CLI is not installed. Please install it first.${NC}"
            exit 1
        fi
        
        RESOURCE_GROUP=${AZURE_RESOURCE_GROUP:-"k-group-rg"}
        CONTAINER_NAME=${AZURE_CONTAINER_NAME:-"k-group-back"}
        LOCATION=${AZURE_LOCATION:-"eastus"}
        
        echo -e "${YELLOW}📝 Creating container instance...${NC}"
        
        # Build and push to Azure Container Registry
        az acr build --registry $AZURE_REGISTRY_NAME --image k-group-back:latest .
        
        echo -e "${GREEN}✅ Ready for Azure deployment!${NC}"
        echo -e "${YELLOW}💡 Next steps:${NC}"
        echo -e "1. Create Azure Database for PostgreSQL"
        echo -e "2. Deploy container instance with proper environment variables"
        echo -e "3. Set up networking and security groups"
        ;;
        
    digitalocean)
        echo -e "${GREEN}🚀 Preparing for DigitalOcean App Platform deployment...${NC}"
        
        echo -e "${YELLOW}📝 Creating app spec file...${NC}"
        cat > .do/app.yaml << EOF
name: k-group-back
services:
- name: api
  source_dir: /
  github:
    repo: your-username/k-group-back
    branch: main
  run_command: npm run start:prod
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env:
  - key: NODE_ENV
    value: production
  - key: PORT
    value: "8080"
  - key: POSTGRESQL_HOST
    value: \${k-group-db.HOSTNAME}
  - key: POSTGRESQL_PORT
    value: \${k-group-db.PORT}
  - key: POSTGRESQL_USER
    value: \${k-group-db.USERNAME}
  - key: POSTGRESQL_PASSWORD
    value: \${k-group-db.PASSWORD}
  - key: POSTGRESQL_DB
    value: \${k-group-db.DATABASE}
  - key: JWT_SECRET
    value: your-jwt-secret-here
databases:
- name: k-group-db
  engine: PG
  version: "13"
  size: basic-xs
EOF
        
        echo -e "${GREEN}✅ App spec created at .do/app.yaml${NC}"
        echo -e "${YELLOW}💡 Next steps:${NC}"
        echo -e "1. Push your code to GitHub"
        echo -e "2. Create app on DigitalOcean App Platform"
        echo -e "3. Upload the app.yaml spec file"
        echo -e "4. Configure environment variables"
        ;;
        
    heroku)
        echo -e "${GREEN}🚀 Preparing for Heroku deployment...${NC}"
        
        # Check if Heroku CLI is installed
        if ! command -v heroku &> /dev/null; then
            echo -e "${RED}❌ Heroku CLI is not installed. Please install it first.${NC}"
            exit 1
        fi
        
        APP_NAME=${HEROKU_APP_NAME:-"k-group-back"}
        
        echo -e "${YELLOW}📝 Creating Heroku app and PostgreSQL addon...${NC}"
        
        # Create Heroku app
        heroku create $APP_NAME --region us
        
        # Add PostgreSQL addon
        heroku addons:create heroku-postgresql:hobby-dev --app $APP_NAME
        
        # Set environment variables
        heroku config:set NODE_ENV=production --app $APP_NAME
        heroku config:set JWT_SECRET=your-jwt-secret-here --app $APP_NAME
        
        # Create Procfile
        echo "web: npm run start:prod" > Procfile
        
        echo -e "${GREEN}✅ Heroku app configured!${NC}"
        echo -e "${YELLOW}💡 Next steps:${NC}"
        echo -e "1. git add ."
        echo -e "2. git commit -m 'Deploy to Heroku'"
        echo -e "3. git push heroku main"
        ;;
        
    *)
        show_usage
        exit 1
        ;;
esac
