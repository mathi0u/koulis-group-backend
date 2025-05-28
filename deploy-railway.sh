#!/bin/bash

# Script to deploy the application to Railway

echo "Preparing to deploy to Railway..."

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

echo "Building application..."
npm run build

echo "Deploying to Railway..."
railway up

echo "Deployment complete! Opening project in browser..."
railway open

echo "Your app should now be accessible at the Railway generated URL."
echo "Use the '/swagger' endpoint to explore the API documentation."
