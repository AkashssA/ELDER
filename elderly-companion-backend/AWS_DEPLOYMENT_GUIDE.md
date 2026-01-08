# Simple AWS Deployment Guide for Beginners 🚀

This guide will help you deploy your Elderly Companion Backend to AWS Elastic Beanstalk - the easiest way for beginners!

## Prerequisites

1. **AWS Account** - Sign up at [aws.amazon.com](https://aws.amazon.com) (Free tier available)
2. **GitHub Account** - Your code is already at https://github.com/AkashssA/ELDER.git ✅

## Step 1: Install Required Tools

### Install AWS CLI
1. Download from: https://aws.amazon.com/cli/
2. Or use PowerShell:
   ```powershell
   winget install Amazon.AWSCLI
   ```
3. Verify installation:
   ```powershell
   aws --version
   ```

### Install EB CLI (Elastic Beanstalk CLI)
```powershell
pip install awsebcli
```

## Step 2: Configure AWS Credentials

1. **Get AWS Access Keys:**
   - Go to AWS Console → IAM → Users → Your Username
   - Click "Security credentials" tab
   - Click "Create access key"
   - Choose "Command Line Interface (CLI)"
   - **SAVE** the Access Key ID and Secret Access Key (you won't see it again!)

2. **Configure AWS CLI:**
   ```powershell
   aws configure
   ```
   - Enter your Access Key ID
   - Enter your Secret Access Key
   - Enter your region (e.g., `us-east-1` or `us-west-2`)
   - Enter output format: `json`

## Step 3: Navigate to Backend Directory

```powershell
cd "C:\Users\akash\OneDrive\Desktop\elderly-companion-backend\elderly-companion-platform\elderly-companion-backend"
```

## Step 4: Initialize Elastic Beanstalk

```powershell
eb init
```

**Follow the prompts:**
1. Select a region (choose one close to you, e.g., `us-east-1`)
2. Application name: `elderly-companion-backend` (or press Enter for default)
3. Platform: Select **"Docker"**
4. Platform version: Select the latest version
5. Set up SSH: `No` (unless you want SSH access)

This creates a `.elasticbeanstalk` folder with configuration.

## Step 5: Create Environment Variables File

Create a file named `.ebextensions/environment.config`:

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    PORT: 5000
    MONGO_URI: "your_mongodb_connection_string_here"
    JWT_SECRET: "your_jwt_secret_here"
    CLOUDINARY_CLOUD_NAME: "your_cloudinary_cloud_name"
    CLOUDINARY_API_KEY: "your_cloudinary_api_key"
    CLOUDINARY_API_SECRET: "your_cloudinary_api_secret"
    TWILIO_ACCOUNT_SID: "your_twilio_account_sid"
    TWILIO_AUTH_TOKEN: "your_twilio_auth_token"
    TWILIO_PHONE_NUMBER: "your_twilio_phone_number"
    GEMINI_API_KEY: "your_gemini_api_key"
    YOUTUBE_API_KEY: "your_youtube_api_key"
    ADMIN_SECRET_KEY: "your_admin_secret_key"
```

**⚠️ IMPORTANT:** Replace all the placeholder values with your actual credentials!

## Step 6: Create and Deploy Your Application

```powershell
eb create elderly-backend-env
```

This will:
- Create an EC2 instance
- Set up a load balancer
- Deploy your Docker container
- Take about 5-10 minutes

**When prompted:**
- Environment name: `elderly-backend-env` (or press Enter)
- DNS CNAME prefix: `elderly-backend` (or press Enter)
- Load balancer type: `application` (press Enter)
- Enable spot fleet: `n` (press Enter)

## Step 7: Set Environment Variables (Alternative Method)

If you didn't use the `.ebextensions` file, set variables via CLI:

```powershell
eb setenv MONGO_URI="your_mongodb_uri" JWT_SECRET="your_jwt_secret" CLOUDINARY_CLOUD_NAME="your_cloud_name" CLOUDINARY_API_KEY="your_api_key" CLOUDINARY_API_SECRET="your_api_secret" TWILIO_ACCOUNT_SID="your_twilio_sid" TWILIO_AUTH_TOKEN="your_twilio_token" TWILIO_PHONE_NUMBER="your_twilio_phone" GEMINI_API_KEY="your_gemini_key" YOUTUBE_API_KEY="your_youtube_key" ADMIN_SECRET_KEY="your_admin_secret" PORT=5000 NODE_ENV=production
```

## Step 8: Check Your Deployment Status

```powershell
eb status
```

This shows your environment URL. It will look like:
`http://elderly-backend-env.us-east-1.elasticbeanstalk.com`

## Step 9: Test Your Application

Open your browser and visit:
```
http://your-environment-url.elasticbeanstalk.com/api/test
```

You should see: `{"message":"Hello from the backend! 👋"}`

## Step 10: View Logs (If Something Goes Wrong)

```powershell
eb logs
```

This downloads and shows your application logs.

## Common Commands

```powershell
# View environment status
eb status

# View logs
eb logs

# Open in browser
eb open

# Update environment variables
eb setenv VARIABLE_NAME="value"

# Redeploy after code changes
git add .
git commit -m "Your changes"
eb deploy

# Terminate environment (when done testing)
eb terminate elderly-backend-env
```

## Setting Up MongoDB Atlas (Recommended)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Use this as your `MONGO_URI` in environment variables

**Example:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/elderly-companion?retryWrites=true&w=majority
```

## Troubleshooting

### Issue: "Command not found: eb"
**Solution:** Make sure EB CLI is installed: `pip install awsebcli`

### Issue: "Access Denied"
**Solution:** Check your AWS credentials: `aws configure list`

### Issue: "Application failed to start"
**Solution:** 
1. Check logs: `eb logs`
2. Verify environment variables are set correctly
3. Make sure MongoDB URI is accessible from AWS

### Issue: "Port 5000 already in use"
**Solution:** Elastic Beanstalk handles port mapping automatically, but make sure your app listens on `process.env.PORT || 5000`

## Cost Estimate

- **Free Tier:** First 12 months free (750 hours/month of t2.micro)
- **After Free Tier:** ~$15-30/month for basic setup
- **MongoDB Atlas:** Free tier available (512MB storage)

## Next Steps

1. ✅ Your code is on GitHub
2. ✅ Docker files are ready
3. ⏭️ Follow steps above to deploy
4. 🎉 Your backend will be live!

## Need Help?

- AWS Elastic Beanstalk Docs: https://docs.aws.amazon.com/elasticbeanstalk/
- Check logs: `eb logs`
- AWS Support: Available in AWS Console

---

**Quick Deploy Checklist:**
- [ ] AWS account created
- [ ] AWS CLI installed and configured
- [ ] EB CLI installed
- [ ] MongoDB Atlas account created (or local MongoDB)
- [ ] Environment variables ready
- [ ] `eb init` completed
- [ ] `eb create` executed
- [ ] Environment variables set
- [ ] Application tested

Good luck! 🚀
