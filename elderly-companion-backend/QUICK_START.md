# Quick Start - Deploy to AWS in 5 Steps 🚀

## Prerequisites Checklist
- [ ] AWS Account (free tier works!)
- [ ] GitHub repo: https://github.com/AkashssA/ELDER.git ✅

## Step 1: Install Tools (One-time setup)

```powershell
# Install AWS CLI
winget install Amazon.AWSCLI

# Install EB CLI
pip install awsebcli
```

## Step 2: Configure AWS

```powershell
aws configure
```
Enter your AWS Access Key ID, Secret Key, and region when prompted.

**Get AWS Keys:** AWS Console → IAM → Users → Your User → Security Credentials → Create Access Key

## Step 3: Navigate to Backend

```powershell
cd "C:\Users\akash\OneDrive\Desktop\elderly-companion-backend\elderly-companion-platform\elderly-companion-backend"
```

## Step 4: Initialize & Deploy

```powershell
# Initialize Elastic Beanstalk
eb init

# When prompted:
# - Select region (e.g., us-east-1)
# - Application name: elderly-companion-backend
# - Platform: Docker
# - Platform version: Latest

# Create and deploy
eb create elderly-backend-env
```

## Step 5: Set Environment Variables

**Option A: Using EB CLI (Recommended)**
```powershell
eb setenv MONGO_URI="your_mongodb_uri" JWT_SECRET="your_secret" PORT=5000 NODE_ENV=production
# Add all other variables...
```

**Option B: Edit `.ebextensions/environment.config`** and uncomment/add your values, then:
```powershell
eb deploy
```

## Test Your Deployment

```powershell
eb open
```

Visit: `http://your-url.elasticbeanstalk.com/api/test`

## That's It! 🎉

Your backend is now live on AWS!

**Useful Commands:**
- `eb status` - Check deployment status
- `eb logs` - View application logs
- `eb deploy` - Redeploy after code changes
- `eb terminate elderly-backend-env` - Delete environment

For detailed instructions, see `AWS_DEPLOYMENT_GUIDE.md`
