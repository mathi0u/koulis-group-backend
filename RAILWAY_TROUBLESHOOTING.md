# Railway Deployment Troubleshooting Guide

This guide provides solutions for common issues encountered when deploying the K-Group application to Railway.

## Health Check Failures

If Railway reports health check failures:

1. **Check the logs**:
   - Go to your Railway dashboard
   - Click on your service
   - Select the "Logs" tab
   - Look for any error messages

2. **Verify health endpoint**:
   - Health check endpoint should be accessible at `/api/health`
   - Ensure the application has started properly
   - Check that database connections are successful

3. **Environment variables**:
   - Verify all required environment variables are set in Railway
   - Database credentials are correctly configured
   - JWT_SECRET is properly set
   - Check POSTGRESQL_SSL is set to true
   - Ensure NODE_ENV is set to production

4. **Database issues**:
   - Ensure PostgreSQL service is running on Railway
   - Check database connection string is correct
   - Verify database synchronization is enabled (SYNC=true)
   - Look for table creation errors in logs

## Module-Specific Issues

### Accounting Module
- Check if accounting tables were created correctly
- Verify relationships between Payment and Accounting entities

### Subscriptions Module
- Check if subscription tables were created correctly
- Verify relationships with clients and programs
- Look for errors in subscription creation or renewal

### Client Module
- Verify client creation and data integrity
- Check for errors in email uniqueness constraints

## Manual Verification Steps

If health checks are failing, try these steps:

1. SSH into your Railway deployment:
   ```bash
   railway login
   railway connect
   ```

2. Check if the application is running:
   ```bash
   ps aux | grep node
   ```

3. Test the health endpoint directly:
   ```bash
   curl localhost:$PORT/api/health
   ```

4. Check for database connectivity:
   ```bash
   echo "SELECT 1;" | psql $DATABASE_URL
   ```

5. Verify database tables were created:
   ```bash
   echo "\dt" | psql $DATABASE_URL
   ```

6. Check for specific tables (e.g., clients):
   ```bash
   echo "SELECT COUNT(*) FROM client;" | psql $DATABASE_URL
   ```

## Common Solutions

1. **Restart the service**:
   - Sometimes a simple restart resolves transient issues
   - In the Railway dashboard, click "Restart" on your service

2. **Database initialization**:
   - If the database is new, ensure schemas are created correctly
   - Railway PostgreSQL plugin should be added before application deployment
   - Check that SYNC=true is set to allow TypeORM to create tables

3. **CORS issues**:
   - If frontend can't connect, check CORS configuration 
   - Ensure your frontend URL is added to the allowed origins
   - Set FRONTEND_URL environment variable with your frontend domain

4. **Memory limits**:
   - If the app crashes due to memory limits, consider upgrading your plan
   - Optimize your application code to reduce memory usage

5. **Entity relationship issues**:
   - If you see errors about foreign keys or constraints, check entity relationships
   - Verify that table creation order is correct
   - May need to temporarily disable foreign key checks

6. **SSL connection issues**:
   - Make sure POSTGRESQL_SSL=true for Railway database connections
   - Check for SSL/TLS error messages in logs
