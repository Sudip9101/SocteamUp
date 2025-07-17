# SocTeamUp JAMStack Deployment Guide

This guide covers the complete deployment process for the SocTeamUp JAMStack platform, including both the static frontend and serverless backend.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Site   │    │   API Gateway   │    │ Lambda Functions│
│   (Frontend)    │────│   + CORS        │────│   + DynamoDB    │
│   Next.js/CDN   │    │                 │    │   + SES         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

### Required Tools
- Node.js 18.0 or higher
- AWS CLI configured with appropriate permissions
- AWS SAM CLI for serverless deployment
- Git for version control

### AWS Permissions Required
- Lambda (full access)
- API Gateway (full access)
- DynamoDB (full access)
- SES (send email permissions)
- CloudFormation (full access)
- IAM (role creation)
- CloudWatch Logs (full access)

## 🚀 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Initial SocTeamUp website"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings:
     ```
     Framework Preset: Next.js
     Build Command: npm run build
     Output Directory: (leave default)
     Install Command: npm install
     ```

3. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-api-gateway-url
   ```

### Option 2: Netlify

1. **Build for Static Export**
   ```bash
   npm run build
   npm run export
   ```

2. **Deploy to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect GitHub repository with build settings:
     ```
     Build command: npm run build && npm run export
     Publish directory: dist
     ```

### Option 3: AWS S3 + CloudFront

1. **Build Static Site**
   ```bash
   npm run build
   npm run export
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://socteamup-website-bucket
   aws s3 website s3://socteamup-website-bucket --index-document index.html
   ```

3. **Upload Files**
   ```bash
   aws s3 sync dist/ s3://socteamup-website-bucket --delete
   ```

4. **Create CloudFront Distribution**
   - Origin: S3 bucket website endpoint
   - Cache behaviors for optimized performance
   - Custom domain and SSL certificate

## ⚡ Backend Deployment

### Prerequisites Setup

1. **Install AWS SAM CLI**
   ```bash
   # macOS
   brew tap aws/tap
   brew install aws-sam-cli
   
   # Windows
   # Download from AWS SAM releases page
   
   # Verify installation
   sam --version
   ```

2. **Configure AWS Credentials**
   ```bash
   aws configure
   # Enter your Access Key ID, Secret Key, Region, and Output format
   ```

### Deploy Serverless Functions

1. **Install Lambda Dependencies**
   ```bash
   cd lambda
   npm install
   cd ..
   ```

2. **Build SAM Application**
   ```bash
   sam build
   ```

3. **Deploy with Parameters**
   ```bash
   sam deploy --guided
   ```

   **Parameter Configuration:**
   ```
   Stack Name: socteamup-backend-dev
   AWS Region: us-east-1
   Environment: dev
   FrontendUrl: https://your-vercel-app.vercel.app
   ContactEmail: support@socteamup.com
   FromEmail: noreply@socteamup.com
   JWTSecret: your-super-secret-jwt-key-here
   ```

4. **Note the API Gateway URL**
   After deployment, copy the API Gateway URL from the outputs.

### SES Email Configuration

1. **Verify Email Addresses**
   ```bash
   aws ses verify-email-identity --email-address noreply@socteamup.com
   aws ses verify-email-identity --email-address support@socteamup.com
   ```

2. **Request Production Access** (Optional)
   - For production, request SES production access
   - This removes the sandbox limitations

### Environment-Specific Deployments

**Development:**
```bash
sam deploy --parameter-overrides Environment=dev FrontendUrl=http://localhost:3000
```

**Staging:**
```bash
sam deploy --parameter-overrides Environment=staging FrontendUrl=https://staging.socteamup.com
```

**Production:**
```bash
sam deploy --parameter-overrides Environment=prod FrontendUrl=https://socteamup.com
```

## 🔗 Integration

### Connect Frontend to Backend

1. **Update Frontend Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://your-api-gateway-id.execute-api.region.amazonaws.com/dev
   ```

2. **Test API Endpoints**
   ```bash
   # Test contact form
   curl -X POST https://your-api-url/api/contact \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Hello"}'
   
   # Test user registration
   curl -X POST https://your-api-url/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"John","email":"john@example.com","password":"Password123","confirmPassword":"Password123"}'
   ```

## 🔧 Custom Domain Setup

### Frontend Domain (Vercel)

1. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Add your domain (e.g., socteamup.com)
   - Configure DNS records as instructed

### Backend Domain (API Gateway)

1. **Create Custom Domain**
   ```bash
   aws apigateway create-domain-name \
     --domain-name api.socteamup.com \
     --certificate-arn arn:aws:acm:region:account:certificate/cert-id
   ```

2. **Create Base Path Mapping**
   ```bash
   aws apigateway create-base-path-mapping \
     --domain-name api.socteamup.com \
     --rest-api-id your-api-id \
     --stage dev
   ```

## 📊 Monitoring & Logging

### CloudWatch Dashboards

1. **Create Custom Dashboard**
   - Lambda function metrics
   - API Gateway metrics
   - DynamoDB metrics
   - Error rates and latencies

### Log Monitoring

1. **Set Up Log Alarms**
   ```bash
   aws logs put-metric-filter \
     --log-group-name /aws/lambda/socteamup-contact-form-dev \
     --filter-name ErrorCount \
     --filter-pattern "ERROR" \
     --metric-transformations metricName=LambdaErrors,metricNamespace=SocTeamUp,metricValue=1
   ```

## 🔒 Security Best Practices

### Environment Variables

1. **Use AWS Systems Manager Parameter Store**
   ```bash
   aws ssm put-parameter \
     --name "/socteamup/dev/jwt-secret" \
     --value "your-jwt-secret" \
     --type "SecureString"
   ```

### API Security

1. **Rate Limiting**
   - Configure API Gateway throttling
   - Set burst and rate limits

2. **CORS Configuration**
   - Restrict origins to your domain
   - Limit allowed methods and headers

## 🧪 Testing Deployment

### Automated Testing

1. **Frontend Testing**
   ```bash
   npm run build
   npm run lint
   ```

2. **Backend Testing**
   ```bash
   cd lambda
   npm test
   ```

### Manual Testing Checklist

- [ ] Home page loads correctly
- [ ] Navigation works between all pages
- [ ] Contact form submits successfully
- [ ] Login/registration forms function
- [ ] Mobile responsiveness
- [ ] Page load speeds < 3 seconds
- [ ] All API endpoints respond correctly
- [ ] Email notifications are sent

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy SocTeamUp

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: aws-actions/setup-sam@v2
      - uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: sam build
      - run: sam deploy --no-confirm-changeset --no-fail-on-empty-changeset
```

## 📈 Performance Optimization

### Frontend Optimization

1. **Image Optimization**
   - Use Next.js Image component
   - Implement lazy loading
   - WebP format for modern browsers

2. **Bundle Optimization**
   - Tree shaking for unused code
   - Code splitting for large bundles
   - CDN caching strategies

### Backend Optimization

1. **Lambda Configuration**
   - Right-size memory allocation
   - Optimize cold start times
   - Use Lambda layers for shared dependencies

2. **Database Optimization**
   - DynamoDB on-demand vs. provisioned
   - Global secondary indexes
   - TTL for temporary data

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify API Gateway CORS configuration
   - Check frontend URL in Lambda environment variables

2. **Lambda Timeouts**
   - Increase timeout in template.yaml
   - Optimize function code for performance

3. **SES Email Issues**
   - Verify email addresses in SES console
   - Check for sandbox limitations

### Debug Commands

```bash
# Check Lambda logs
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/socteamup

# Get API Gateway details
aws apigateway get-rest-apis

# Check DynamoDB table
aws dynamodb describe-table --table-name socteamup-users-dev
```

## 📞 Support

For deployment issues or questions:

- **Documentation:** Check this guide and README.md
- **AWS Support:** AWS Premium Support for infrastructure issues
- **Community:** GitHub Issues for bugs and feature requests
- **Email:** devops@socteamup.com for deployment assistance

---

**Deployment checklist complete! Your JAMStack application should now be live and functional.** 🎉 