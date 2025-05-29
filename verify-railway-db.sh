#!/bin/bash

# Script to verify database setup on Railway and initialize if needed
# Run this after deployment if you're having database issues

echo "K-Group Railway Database Verification Tool"
echo "=========================================="

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

echo "Connecting to Railway database..."
DATABASE_URL=$(railway variables get DATABASE_URL)

if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL not found. Do you have a PostgreSQL plugin added to your project?"
  exit 1
fi

echo "✅ Database connection found."
echo "Checking database tables..."

# Function to execute SQL and return results
execute_sql() {
    echo "$1" | railway run psql "$DATABASE_URL" -t -c "$1"
}

# Check if tables exist
TABLES=$(execute_sql "\dt")
echo -e "\nCurrent tables in database:"
echo "$TABLES"

echo -e "\nChecking for specific tables needed by K-Group application:"

check_table() {
    TABLE_COUNT=$(execute_sql "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '$1';")
    if [ "$TABLE_COUNT" -gt "0" ]; then
        echo "✅ Table $1 exists"
        return 0
    else
        echo "❌ Table $1 does not exist"
        return 1
    fi
}

# Check for essential tables
check_table "client"
check_table "subscription"
check_table "program"
check_table "service"
check_table "payment"
check_table "accounting"

# Ask if user wants to force table recreation
echo -e "\nWould you like to force table recreation by toggling SYNC flag? (y/n)"
read -r answer

if [[ "$answer" =~ ^[Yy]$ ]]; then
    echo "Setting SYNC=false..."
    railway variables set SYNC=false
    
    echo "Restarting service to apply changes..."
    railway service restart
    
    echo "Waiting for service to restart (10 seconds)..."
    sleep 10
    
    echo "Setting SYNC=true to recreate tables..."
    railway variables set SYNC=true
    
    echo "Restarting service again to create tables..."
    railway service restart
    
    echo "Database tables should be recreated on service startup."
    echo "Check the logs in Railway dashboard to confirm."
fi

echo -e "\nWould you like to see the current environment variables? (y/n)"
read -r answer

if [[ "$answer" =~ ^[Yy]$ ]]; then
    echo "Current environment variables:"
    railway variables
fi

echo -e "\nDone. Remember to check application logs for any database errors."
