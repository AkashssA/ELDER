# Deployment Guide for Elderly Companion Backend

This guide will help you deploy the Elderly Companion Backend application using Docker.

## Prerequisites

- Docker installed on your system ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (usually comes with Docker Desktop)
- MongoDB database (local or cloud-hosted like MongoDB Atlas)
- Environment variables configured

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
MONGO_URI=mongodb://localhost:27017/elderly-companion
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

NODE_ENV=production
PORT=5000

# Add your other environment variables:
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
# JWT_SECRET=your_jwt_secret
# TWILIO_ACCOUNT_SID=your_twilio_sid
# TWILIO_AUTH_TOKEN=your_twilio_token
# GOOGLE_AI_API_KEY=your_google_ai_key
```

## Local Development with Docker

### Option 1: Using Docker Compose (Recommended)

1. Make sure you have a `.env` file with all required variables
2. Build and start the container:
   ```bash
   docker-compose up --build
   ```
3. The server will be available at `http://localhost:5000`

### Option 2: Using Docker Commands

1. Build the Docker image:
   ```bash
   docker build -t elderly-companion-backend .
   ```

2. Run the container:
   ```bash
   docker run -d \
     --name elderly-companion-backend \
     -p 5000:5000 \
     --env-file .env \
     elderly-companion-backend
   ```

## Deployment Options

### 1. Deploy to AWS (EC2/ECS/Elastic Beanstalk)

#### AWS EC2:
1. Launch an EC2 instance (Ubuntu recommended)
2. Install Docker on the instance:
   ```bash
   sudo apt-get update
   sudo apt-get install docker.io docker-compose -y
   ```
3. Clone your repository and build:
   ```bash
   git clone <your-repo-url>
   cd elderly-companion-backend/elderly-companion-platform/elderly-companion-backend
   docker build -t elderly-companion-backend .
   ```
4. Run with environment variables:
   ```bash
   docker run -d -p 5000:5000 --env-file .env elderly-companion-backend
   ```

#### AWS ECS (Elastic Container Service):
1. Build and push image to Amazon ECR:
   ```bash
   aws ecr create-repository --repository-name elderly-companion-backend
   docker tag elderly-companion-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/elderly-companion-backend:latest
   docker push <account-id>.dkr.ecr.<region>.amazonaws.com/elderly-companion-backend:latest
   ```
2. Create ECS task definition and service
3. Configure environment variables in ECS task definition

### 2. Deploy to Google Cloud Platform (Cloud Run)

1. Install Google Cloud SDK
2. Build and push to Google Container Registry:
   ```bash
   gcloud builds submit --tag gcr.io/<project-id>/elderly-companion-backend
   ```
3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy elderly-companion-backend \
     --image gcr.io/<project-id>/elderly-companion-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars MONGO_URI=<your-mongo-uri>
   ```

### 3. Deploy to Azure (Container Instances/App Service)

1. Build and push to Azure Container Registry:
   ```bash
   az acr build --registry <registry-name> --image elderly-companion-backend:latest .
   ```
2. Deploy to Azure Container Instances:
   ```bash
   az container create \
     --resource-group <resource-group> \
     --name elderly-companion-backend \
     --image <registry-name>.azurecr.io/elderly-companion-backend:latest \
     --dns-name-label <unique-dns-name> \
     --ports 5000 \
     --environment-variables MONGO_URI=<your-mongo-uri>
   ```

### 4. Deploy to DigitalOcean (App Platform/Droplets)

#### App Platform:
1. Connect your GitHub repository
2. Select Dockerfile as build method
3. Configure environment variables in the dashboard
4. Deploy

#### Droplets:
Similar to AWS EC2 deployment process

### 5. Deploy to Heroku

1. Install Heroku CLI
2. Create `heroku.yml`:
   ```yaml
   build:
     docker:
       web: Dockerfile
   ```
3. Deploy:
   ```bash
   heroku create elderly-companion-backend
   heroku config:set MONGO_URI=<your-mongo-uri>
   heroku stack:set container
   git push heroku main
   ```

### 6. Deploy to Railway

1. Connect your GitHub repository to Railway
2. Railway will auto-detect the Dockerfile
3. Add environment variables in Railway dashboard
4. Deploy automatically

### 7. Deploy to Render

1. Connect your GitHub repository
2. Select "Docker" as the build method
3. Add environment variables
4. Deploy

## Production Best Practices

1. **Use Environment Variables**: Never hardcode secrets
2. **Use Multi-stage Builds**: For smaller images (optional optimization)
3. **Health Checks**: Add health check endpoint
4. **Logging**: Configure proper logging
5. **Monitoring**: Set up monitoring (e.g., PM2, New Relic)
6. **SSL/TLS**: Use HTTPS in production (consider using a reverse proxy like Nginx)
7. **Database**: Use managed database services (MongoDB Atlas recommended)
8. **Backup**: Set up regular database backups

## Docker Commands Reference

```bash
# Build image
docker build -t elderly-companion-backend .

# Run container
docker run -p 5000:5000 --env-file .env elderly-companion-backend

# View running containers
docker ps

# View logs
docker logs elderly-companion-backend

# Stop container
docker stop elderly-companion-backend

# Remove container
docker rm elderly-companion-backend

# Remove image
docker rmi elderly-companion-backend
```

## Troubleshooting

1. **Port already in use**: Change the port mapping `-p 5001:5000`
2. **Database connection issues**: Verify MONGO_URI is correct and accessible
3. **Environment variables not loading**: Ensure `.env` file exists and variables are set correctly
4. **Container exits immediately**: Check logs with `docker logs <container-name>`

## Support

For issues or questions, check the application logs:
```bash
docker logs -f elderly-companion-backend
```
