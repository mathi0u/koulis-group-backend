#!/bin/bash

# Development deployment script for k-group-back
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting k-group-back in development mode...${NC}"

# Load environment variables if .env exists
if [ -f .env ]; then
    echo -e "${YELLOW}📝 Loading environment variables from .env file...${NC}"
    export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)
fi

# Start only the database for development
echo -e "${GREEN}🗄️  Starting PostgreSQL database...${NC}"
docker-compose up -d postgres

# Wait for database to be ready
echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"
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
    exit 1
fi

echo -e "${GREEN}🎉 Development environment ready!${NC}"
echo -e "${GREEN}🗄️  PostgreSQL is running on port: ${POSTGRES_PORT:-5432}${NC}"
echo -e "${YELLOW}💡 Now you can start your application with: npm run start:dev${NC}"
echo -e "${YELLOW}💡 Database connection string: postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@localhost:${POSTGRES_PORT:-5432}/${POSTGRES_DB:-kg}${NC}"
