# K-Group Backend - Railway Deployment Guide

This document provides a step-by-step guide for deploying the K-Group backend application to Railway.

## Prerequisites

- A [Railway](https://railway.app) account
- Railway CLI installed (`npm i -g @railway/cli`)
- Git repository with your K-Group backend code

## Deployment Steps

### 1. Prepare Your Project

Make sure your code is committed to a Git repository. Railway can deploy directly from GitHub or from your local repository.

### 2. Create a Railway Project

1. Log in to Railway:
   ```bash
   railway login
   ```

2. Create a new project:
   ```bash
   railway init
   ```
   
3. Link your project (if you already created one in the Railway dashboard):
   ```bash
   railway link
   ```

### 3. Add PostgreSQL Database

1. Add a PostgreSQL plugin to your project through the Railway dashboard
   - Go to your project
   - Click "New"
   - Select "PostgreSQL"

### 4. Configure Environment Variables

Run our setup script to automatically configure the required environment variables:

```bash
npm run setup:railway-postgres
```

This script will:
- Get PostgreSQL connection details from Railway
- Set up environment variables for database connection
- Generate a JWT secret
- Configure additional necessary variables

### 5. Deploy Your Application

Deploy the application with a single command:

```bash
npm run deploy:railway
```

### 6. Verify Deployment

After deployment, your application will be accessible at the Railway-provided URL.

Check these endpoints to verify successful deployment:
- Health check: `YOUR_URL/api/health`
- API documentation: `YOUR_URL/swagger`

### 7. Troubleshooting

If you encounter any issues:

1. Check the application logs in the Railway dashboard
2. Verify database tables were created correctly:
   ```bash
   npm run verify:railway-db
   ```
3. Refer to `RAILWAY_TROUBLESHOOTING.md` for common issues and solutions

## Application Structure

The K-Group backend consists of several modules:

- **Clients**: Customer management
- **Accounting**: Financial transactions
- **Subscriptions**: Membership plans
- **Programs**: Training programs
- **Services**: Services offered
- **Payments**: Payment processing

Each module has its own database tables and API endpoints, all documented in Swagger.

## Connecting the Frontend

To connect your frontend application:

1. Set the `FRONTEND_URL` environment variable to your frontend's domain
2. Update your frontend API configuration to point to your Railway backend URL
