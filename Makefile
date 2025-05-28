.PHONY: help dev build deploy deploy-prod deploy-cloud clean logs stop restart health

# Default target
help:
	@echo "K-Group Backend Deployment Commands"
	@echo "====================================="
	@echo ""
	@echo "Development:"
	@echo "  dev                 Start development environment (database only)"
	@echo "  build               Build Docker images"
	@echo ""
	@echo "Deployment:"
	@echo "  deploy              Deploy with Docker Compose"
	@echo "  deploy-prod         Deploy with Nginx for production"
	@echo "  deploy-cloud        Deploy to cloud (see deploy-cloud.sh for options)"
	@echo ""
	@echo "Management:"
	@echo "  logs                Show all container logs"
	@echo "  logs-app            Show application logs"
	@echo "  logs-db             Show database logs"
	@echo "  stop                Stop all containers"
	@echo "  restart             Restart all containers"
	@echo "  clean               Clean up containers and images"
	@echo ""
	@echo "Monitoring:"
	@echo "  health              Check application health"
	@echo "  status              Show container status"

# Development
dev:
	@echo "🚀 Starting development environment..."
	./deploy-dev.sh

build:
	@echo "📦 Building Docker images..."
	docker build -t k-group-back:latest .

# Deployment
deploy:
	@echo "🚀 Deploying with Docker Compose..."
	./deploy.sh

deploy-prod:
	@echo "🚀 Deploying production with Nginx..."
	./deploy-production.sh

deploy-cloud:
	@echo "☁️ See available cloud deployment options..."
	./deploy-cloud.sh

# Management
logs:
	@echo "📋 Showing all container logs..."
	docker-compose logs -f

logs-app:
	@echo "📋 Showing application logs..."
	docker-compose logs -f app

logs-db:
	@echo "📋 Showing database logs..."
	docker-compose logs -f postgres

stop:
	@echo "🛑 Stopping all containers..."
	docker-compose down
	docker-compose --profile production down

restart:
	@echo "🔄 Restarting containers..."
	docker-compose restart

clean:
	@echo "🧹 Cleaning up containers and images..."
	docker-compose down --remove-orphans
	docker-compose --profile production down --remove-orphans
	docker system prune -f

# Monitoring
health:
	@echo "🔍 Checking application health..."
	@curl -f http://localhost:8080/api/health || echo "❌ Health check failed"

status:
	@echo "📊 Container status..."
	docker-compose ps
