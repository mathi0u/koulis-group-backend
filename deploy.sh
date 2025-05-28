#!/bin/bash

# Build and deployment script for k-group-back
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Building and deploying k-group-back...${NC}"

# Load environment variables if .env exists
if [ -f .env ]; then
    echo -e "${YELLOW}📝 Loading environment variables from .env file...${NC}"
    export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)
else
    echo -e "${YELLOW}⚠️  No .env file found. Using default values...${NC}"
fi

# Build the Docker image
echo -e "${GREEN}📦 Building Docker image...${NC}"
docker build -t k-group-back:latest . --no-cache

# Stop existing containers gracefully
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose down --remove-orphans

# Clean up unused images and volumes (optional)
echo -e "${YELLOW}🧹 Cleaning up unused Docker resources...${NC}"
docker system prune -f --volumes

# Start the services
echo -e "${GREEN}🚀 Starting services...${NC}"
docker-compose up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 45

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

if [ $attempt -gt $max_attempts ]; then
    echo -e "${RED}❌ Database connection failed after $max_attempts attempts!${NC}"
    docker-compose logs postgres
    exit 1
fi

# Check if app is healthy
echo -e "${GREEN}🔍 Checking application health...${NC}"
sleep 10

if curl -f -s http://localhost:${APP_PORT:-8080}/api/health > /dev/null; then
    echo -e "${GREEN}✅ Application is healthy!${NC}"
    
    # Display running services
    echo -e "${GREEN}📊 Running services:${NC}"
    docker-compose ps
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${GREEN}📝 Application is running at: http://localhost:${APP_PORT:-8080}${NC}"
    echo -e "${GREEN}📚 Swagger documentation: http://localhost:${APP_PORT:-8080}/swagger${NC}"
    echo -e "${GREEN}🗄️  Database is running on port: ${POSTGRES_PORT:-5432}${NC}"
    
else
    echo -e "${RED}❌ Application health check failed!${NC}"
    echo -e "${RED}📋 Application logs:${NC}"
    docker-compose logs app
    echo -e "${RED}📋 Database logs:${NC}"
    docker-compose logs postgres
    exit 1
fi
