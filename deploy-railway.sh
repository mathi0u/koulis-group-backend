#!/bin/bash

# Script to deploy the K-Group application to Railway

echo "============================================="
echo "Preparing to deploy K-Group Backend to Railway"
echo "============================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Railway CLI not found. Installing..."
    npm i -g @railway/cli
fi

# Check if user is logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "Please log in to Railway:"
    railway login
fi

# Check if project is linked to a Railway project
if ! railway link &> /dev/null; then
    echo "Linking to Railway project..."
    railway link
fi

# Check for required environment variables
echo "Checking environment variables..."
MISSING_VARS=false

check_var() {
    if [ -z "$(railway variables get $1)" ]; then
        echo "⚠️  Missing required environment variable: $1"
        MISSING_VARS=true
    else
        echo "✅ $1 is set"
    fi
}

check_var "POSTGRESQL_HOST"
check_var "POSTGRESQL_PORT"
check_var "POSTGRESQL_USER"
check_var "POSTGRESQL_PASSWORD"
check_var "POSTGRESQL_DB"
check_var "JWT_SECRET"
check_var "NODE_ENV"

if [ "$MISSING_VARS" = true ]; then
    echo "Some required environment variables are missing."
    echo "Would you like to run the setup script to configure them? (y/n)"
    read -r answer
    if [[ "$answer" =~ ^[Yy]$ ]]; then
        ./setup-railway-postgres.sh
    else
        echo "Please set these variables manually before deploying."
        echo "You can use 'railway variables set KEY=VALUE' to set them."
        exit 1
    fi
fi

echo "Cleaning build directory..."
rm -rf dist

echo "Installing dependencies..."
npm ci

echo "Building application..."
npm run build

echo "Verifying build was successful..."
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
    echo "❌ Build failed, dist directory is empty or doesn't exist!"
    exit 1
fi

echo "Deploying to Railway..."
railway up

echo "============================================="
echo "Deployment complete! Opening project in browser..."
railway open

echo "Your app should now be accessible at the Railway generated URL."
echo "Use the '/api/health' endpoint to check if the API is running."
echo "Use the '/swagger' endpoint to explore the API documentation."
echo "============================================="
