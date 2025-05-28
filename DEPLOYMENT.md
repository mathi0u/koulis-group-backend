# K-Group Back - Deployment Guide

This guide covers different deployment options for the K-Group backend application.

## 🏗️ Architecture

- **Backend**: NestJS with Fastify
- **Database**: PostgreSQL
- **Container**: Docker with multi-stage builds
- **Reverse Proxy**: Nginx (for production)

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- Git

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo>
cd k-group-back
cp .env.example .env
# Edit .env with your configuration
```

### 2. Choose Your Deployment Method

## 🛠️ Development Deployment

For local development with external database:

```bash
# Start only PostgreSQL database
./deploy-dev.sh

# In another terminal, start the application
npm install
npm run start:dev
```

The application will be available at `http://localhost:8080`

## 🐳 Docker Deployment (Local/VPS)

For full Docker deployment:

```bash
# Build and deploy with Docker Compose
./deploy.sh
```

This will:
- Build the optimized Docker image
- Start PostgreSQL database
- Start the NestJS application
- Perform health checks

Access:
- **Application**: `http://localhost:8080`
- **API Documentation**: `http://localhost:8080/swagger`
- **Health Check**: `http://localhost:8080/api/health`

## 🌐 Production Deployment

For production with Nginx reverse proxy:

```bash
# Deploy with Nginx
./deploy-production.sh
```

This includes:
- Nginx reverse proxy
- SSL/TLS termination support
- Rate limiting
- Security headers
- Production optimizations

Access:
- **Application**: `http://localhost` (port 80)
- **HTTPS**: Configure SSL certificates in `ssl/` directory

## ☁️ Cloud Deployment

Use the cloud deployment script for various providers:

```bash
# See available options
./deploy-cloud.sh

# Deploy to specific provider
./deploy-cloud.sh aws
./deploy-cloud.sh gcp
./deploy-cloud.sh azure
./deploy-cloud.sh digitalocean
./deploy-cloud.sh heroku
```

### Cloud Provider Specifics

#### AWS ECS
- Requires AWS CLI configured
- Uses ECR for image registry
- Needs RDS PostgreSQL instance

#### Google Cloud Run
- Requires gcloud CLI
- Serverless deployment
- Use Cloud SQL for PostgreSQL

#### Azure Container Instances
- Requires Azure CLI
- Use Azure Database for PostgreSQL

#### DigitalOcean App Platform
- Git-based deployment
- Managed PostgreSQL database
- Auto-scaling

#### Heroku
- Git-based deployment
- Heroku PostgreSQL addon
- Easy scaling

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Application
NODE_ENV=production
APP_PORT=8080

# Database
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=kg

# Security
JWT_SECRET=your-super-secure-jwt-secret-32-chars-min

# CORS
CORS_ORIGINS=https://yourdomain.com
```

### Database Configuration

The application uses PostgreSQL with the following default settings:
- Host: `postgres` (in Docker) or `localhost` (local)
- Port: `5432`
- Database: `kg`
- User: `postgres`

### SSL/HTTPS Configuration

For production HTTPS:

1. Place SSL certificates in `ssl/` directory:
   - `ssl/fullchain.pem`
   - `ssl/privkey.pem`

2. Uncomment HTTPS server block in `nginx.conf`

3. Update CORS origins to use HTTPS URLs

## 📊 Monitoring & Health Checks

### Health Check Endpoint

- **URL**: `/api/health`
- **Method**: GET
- **Response**: Application status and uptime

### Docker Health Checks

All containers include health checks:
- Database: PostgreSQL connection check
- Application: HTTP health endpoint check
- Nginx: Service availability check

### Logging

View logs for debugging:

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs app
docker-compose logs postgres
docker-compose logs nginx
```

## 🔒 Security Best Practices

### Container Security
- Non-root user execution
- Multi-stage builds for minimal attack surface
- No unnecessary packages in production image

### Application Security
- Input validation with class-validator
- JWT authentication
- CORS configuration
- Rate limiting (via Nginx)

### Database Security
- Strong passwords
- Network isolation
- Regular backups

## 🚦 Performance Optimization

### Docker Optimizations
- Multi-stage builds
- Layer caching
- Minimal base images (Alpine Linux)
- Production dependencies only

### Application Optimizations
- Fastify instead of Express
- Connection pooling
- Swagger documentation
- Gzip compression (via Nginx)

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check database logs
   docker-compose logs postgres
   
   # Verify connection
   docker-compose exec postgres pg_isready -U postgres -d kg
   ```

2. **Application Won't Start**
   ```bash
   # Check application logs
   docker-compose logs app
   
   # Verify environment variables
   docker-compose exec app env
   ```

3. **Health Check Failing**
   ```bash
   # Test health endpoint directly
   curl http://localhost:8080/api/health
   
   # Check if port is accessible
   netstat -tulpn | grep 8080
   ```

### Performance Issues

1. **Slow Database Queries**
   - Enable query logging in development
   - Add database indexes
   - Optimize TypeORM relations

2. **High Memory Usage**
   - Monitor container resources
   - Optimize Node.js heap size
   - Review memory leaks

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Nginx Configuration](https://nginx.org/en/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Test deployment scripts
4. Submit pull request

## 📄 License

[Your License Here]
