#!/bin/bash

# Production deployment script with Nginx for k-group-back
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Deploying k-group-back in production mode with Nginx...${NC}"

# Check if running as root (recommended for production deployment)
if [[ $EUID -ne 0 ]]; then
   echo -e "${YELLOW}⚠️  This script is not running as root. Some operations might require sudo.${NC}"
fi

# Load environment variables if .env exists
if [ -f .env ]; then
    echo -e "${YELLOW}📝 Loading environment variables from .env file...${NC}"
    export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)
else
    echo -e "${RED}❌ No .env file found. Please create one based on .env.example${NC}"
    exit 1
fi

# Validate required environment variables
required_vars=("POSTGRES_PASSWORD" "JWT_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}❌ Required environment variable $var is not set!${NC}"
        exit 1
    fi
done

# Create SSL directory if it doesn't exist
mkdir -p ssl

# Build the Docker image
echo -e "${GREEN}📦 Building optimized Docker image...${NC}"
docker build -t k-group-back:latest . --no-cache

# Stop existing containers gracefully
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose --profile production down --remove-orphans

# Clean up unused images and volumes
echo -e "${YELLOW}🧹 Cleaning up unused Docker resources...${NC}"
docker system prune -f

# Start the services with production profile (includes Nginx)
echo -e "${GREEN}🚀 Starting services with Nginx reverse proxy...${NC}"
docker-compose --profile production up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 60

# Check database connection
echo -e "${GREEN}🔍 Checking database connection...${NC}"
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker-compose exec -T postgres pg_isready -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-kg} > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Database is ready!${NC}"
        break
    else
        echo -e "${YELLOW}⏳ Waiting for database... (attempt $attempt/$max_attempts)${NC}"
        sleep 2
        ((attempt++))
    fi
done

# Check if app is healthy
echo -e "${GREEN}🔍 Checking application health...${NC}"
sleep 10

if curl -f -s http://localhost/api/health > /dev/null; then
    echo -e "${GREEN}✅ Application is healthy and accessible through Nginx!${NC}"
    
    # Display running services
    echo -e "${GREEN}📊 Running services:${NC}"
    docker-compose --profile production ps
    
    echo -e "${GREEN}🎉 Production deployment completed successfully!${NC}"
    echo -e "${BLUE}🌐 Application is running at: http://localhost${NC}"
    echo -e "${BLUE}📚 Swagger documentation: http://localhost/swagger${NC}"
    echo -e "${BLUE}🔒 For HTTPS, configure SSL certificates in the ssl/ directory${NC}"
    echo -e "${YELLOW}💡 To enable HTTPS, uncomment the HTTPS server block in nginx.conf${NC}"
    
else
    echo -e "${RED}❌ Application health check failed!${NC}"
    echo -e "${RED}📋 Application logs:${NC}"
    docker-compose logs app
    echo -e "${RED}📋 Nginx logs:${NC}"
    docker-compose logs nginx
    exit 1
fi
