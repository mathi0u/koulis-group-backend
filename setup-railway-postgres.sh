#!/bin/bash

# Script to help set up PostgreSQL on Railway and perform pre-deployment checks

echo "Setting up PostgreSQL on Railway..."
echo "Make sure you have already created a Railway project and linked it to your local project."

# Check if Railway CLI is available
if ! command -v railway &> /dev/null; then
  echo "Railway CLI not found. Installing..."
  npm install -g @railway/cli
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
  echo "Please log in to Railway first:"
  railway login
fi

# Get Railway PostgreSQL URL
POSTGRES_URL=$(railway variables get DATABASE_URL)

if [ -z "$POSTGRES_URL" ]; then
  echo "Error: DATABASE_URL not found. Please make sure you have added a PostgreSQL plugin to your Railway project."
  exit 1
fi

# Perform pre-deployment checks
echo "Performing pre-deployment checks..."

# Check if build works
echo "Testing build process..."
npm run build || { 
  echo "Build failed. Please fix the build errors before deploying."; 
  exit 1; 
}

# Parse PostgreSQL URL to get components
# Format: postgres://username:password@host:port/database
# Example: postgres://postgres:password@containers-us-west-86.railway.app:7687/railway

# Remove postgres:// prefix
DB_URL_NO_PREFIX=${POSTGRES_URL#postgres://}

# Extract username (up to the colon)
USERNAME=$(echo $DB_URL_NO_PREFIX | cut -d':' -f1)

# Extract password (between first colon and @)
PASSWORD=$(echo $DB_URL_NO_PREFIX | cut -d':' -f2 | cut -d'@' -f1)

# Extract host (between @ and last colon)
HOST=$(echo $DB_URL_NO_PREFIX | cut -d'@' -f2 | cut -d':' -f1)

# Extract port (between last colon and /)
PORT=$(echo $DB_URL_NO_PREFIX | cut -d':' -f3 | cut -d'/' -f1)

# Extract database name (after last /)
DB_NAME=$(echo $DB_URL_NO_PREFIX | cut -d'/' -f2)

echo "Parsed PostgreSQL connection details:"
echo "Host: $HOST"
echo "Port: $PORT"
echo "User: $USERNAME"
echo "Database: $DB_NAME"
echo "Password: [HIDDEN]"

# Set Railway variables for NestJS application
echo "Setting Railway variables for NestJS application..."

railway variables set POSTGRESQL_HOST=$HOST
railway variables set POSTGRESQL_PORT=$PORT
railway variables set POSTGRESQL_USER=$USERNAME
railway variables set POSTGRESQL_PASSWORD=$PASSWORD
railway variables set POSTGRESQL_DB=$DB_NAME
railway variables set POSTGRESQL_SSL=true

echo "Please set your JWT secret:"
read -p "JWT Secret (press Enter to generate a random one): " JWT_SECRET

if [ -z "$JWT_SECRET" ]; then
  # Generate a random JWT secret if not provided
  JWT_SECRET=$(openssl rand -base64 32)
  echo "Generated random JWT secret"
fi

railway variables set JWT_SECRET=$JWT_SECRET
railway variables set NODE_ENV=production
railway variables set SYNC=true

# Set Cross-Origin settings for your frontend
read -p "Frontend URL (leave empty for Railway default): " FRONTEND_URL
if [ -n "$FRONTEND_URL" ]; then
  railway variables set FRONTEND_URL=$FRONTEND_URL
fi

echo "Environment variables have been set up successfully."
echo "You can now deploy your application using 'railway up'"
