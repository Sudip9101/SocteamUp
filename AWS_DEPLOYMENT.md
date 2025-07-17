# AWS Lambda Backend Deployment Guide

This guide will help you deploy the serverless backend for the SoCTeamup contact form using AWS Lambda, API Gateway, and SES.

## Prerequisites

1. **AWS Account**: Ensure you have an active AWS account
2. **AWS CLI**: Install and configure AWS CLI with your credentials
3. **SAM CLI**: Install AWS SAM (Serverless Application Model) CLI
4. **Node.js**: Ensure Node.js 18.x is installed

## Setup Instructions

### 1. Install AWS CLI and SAM CLI

```bash
# Install AWS CLI (if not already installed)
curl "https://awscli.amazonaws.com/awscli-exe-windows-x86_64.msi" -o "AWSCLIV2.msi"
# Run the installer

# Install SAM CLI
# Download from: https://github.com/aws/aws-sam-cli/releases/latest
```

### 2. Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
# Enter output format (json)
```

### 3. Set up SES (Simple Email Service)

Before deploying, you need to verify your email addresses in SES:

```bash
# Verify your "from" email address
aws ses verify-email-identity --email-address noreply@yourdomain.com

# Verify your contact email address
aws ses verify-email-identity --email-address contact@yourdomain.com
```

**Note**: In SES sandbox mode, you can only send emails to verified addresses. To send to any email, request production access.

### 4. Deploy the Serverless Backend

Navigate to the project directory and deploy:

```bash
cd socteamup-website

# Build and deploy using SAM
sam build
sam deploy --guided
```

During the guided deployment, you'll be prompted for:

- **Stack Name**: `socteamup-backend-dev`
- **AWS Region**: `us-east-1` (or your preferred region)
- **Environment**: `dev`
- **Frontend URL**: `http://localhost:3001` (for development) or your production URL
- **Contact Email**: Your email address to receive contact form submissions
- **From Email**: The verified email address for sending automated responses
- **JWT Secret**: A secure random string for authentication

### 5. Update Environment Variables

After deployment, SAM will output the API Gateway URL. Update your environment variables:

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_API_URL=https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/dev
NEXT_PUBLIC_ENVIRONMENT=development
```

For production deployment, update the frontend URL in the SAM parameters:

```bash
sam deploy --parameter-overrides FrontendUrl=https://yourdomain.com Environment=prod
```

## Testing the Contact Form

1. **Start your Next.js development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the contact page**: `http://localhost:3001/contact`

3. **Fill out and submit the contact form**

4. **Check the CloudWatch logs** to verify the Lambda function execution:
   ```bash
   sam logs -n ContactFormFunction --stack-name socteamup-backend-dev --tail
   ```

## Production Deployment

### 1. Domain and SSL Setup

For production, you'll want to:

1. **Set up a custom domain** for your API Gateway
2. **Configure SSL certificates** using AWS Certificate Manager
3. **Update CORS settings** to only allow your production domain

### 2. Environment-Specific Deployments

Deploy separate stacks for different environments:

```bash
# Development
sam deploy --parameter-overrides Environment=dev FrontendUrl=http://localhost:3001

# Staging
sam deploy --parameter-overrides Environment=staging FrontendUrl=https://staging.yourdomain.com

# Production
sam deploy --parameter-overrides Environment=prod FrontendUrl=https://yourdomain.com
```

### 3. Monitoring and Logging

- **CloudWatch Logs**: Monitor Lambda function execution
- **CloudWatch Metrics**: Track API Gateway and Lambda performance
- **X-Ray Tracing**: Enable for distributed tracing (optional)

## Environment Variables Reference

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/stage
NEXT_PUBLIC_ENVIRONMENT=development|staging|production
```

### AWS Lambda (via SAM template)
```yaml
Environment:
  Variables:
    FRONTEND_URL: https://yourdomain.com
    CONTACT_EMAIL: contact@yourdomain.com
    FROM_EMAIL: noreply@yourdomain.com
    JWT_SECRET: your-secure-jwt-secret
```

## Troubleshooting

### Common Issues

1. **SES Email Not Sending**:
   - Verify email addresses in SES console
   - Check if you're in sandbox mode
   - Verify the source email is verified in SES

2. **CORS Errors**:
   - Ensure the frontend URL is correctly set in the SAM template
   - Check API Gateway CORS configuration

3. **Lambda Function Timeout**:
   - Increase timeout in SAM template (default is 30 seconds)
   - Check CloudWatch logs for detailed error messages

4. **API Gateway 502 Errors**:
   - Check Lambda function logs in CloudWatch
   - Verify Lambda function has proper IAM permissions

### Checking Logs

```bash
# View Lambda function logs
sam logs -n ContactFormFunction --stack-name socteamup-backend-dev --tail

# View specific time range
sam logs -n ContactFormFunction --stack-name socteamup-backend-dev --start-time '2024-01-01T00:00:00' --end-time '2024-01-01T23:59:59'
```

## Cost Optimization

- **Lambda**: Pay per request and execution time
- **API Gateway**: Pay per API call
- **SES**: Pay per email sent
- **DynamoDB**: Pay per read/write (for authentication features)

Expected costs for moderate usage (1000 form submissions/month):
- Lambda: ~$0.20
- API Gateway: ~$3.50
- SES: ~$0.10
- Total: ~$3.80/month

## Security Best Practices

1. **Environment Variables**: Never commit sensitive data to Git
2. **IAM Roles**: Use least privilege principle for Lambda execution roles
3. **API Rate Limiting**: Configure API Gateway throttling
4. **Input Validation**: Always validate and sanitize form inputs
5. **CORS**: Restrict to your domain only in production

## Next Steps

1. **Set up monitoring alerts** in CloudWatch
2. **Configure backup strategies** for DynamoDB (if using authentication)
3. **Implement API rate limiting** to prevent abuse
4. **Set up CI/CD pipeline** for automated deployments
5. **Add more sophisticated email templates** in SES

For questions or issues, refer to:
- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/) 

## ✅ **Blog System Features**

### **1. Developer-Managed Content Structure**
- **Blog Content Management System** (`src/lib/blog-content.ts`)
- All content is managed through TypeScript files
- No database or CMS required
- Easy to version control and maintain

### **2. Complete Blog Pages**
- **Main Blog Page** (`/blog`) - Lists all posts with featured section
- **Individual Post Pages** (`/blog/[slug]`) - Rich content display
- **Category Pages** (`/blog/category/[category]`) - Posts by category
- **Tag Pages** (`/blog/tag/[tag]`) - Posts by tag

### **3. Navigation Integration**
- Added "Blog" to the navbar between "About Us" and "Contact Us"
- Seamless navigation throughout the blog system

### **4. Sample Content**
I've created 5 comprehensive blog posts covering:
- 🤖 **AI-Powered Semiconductor Design** (Technology)
- 🏢 **Foundry Partnership Announcement** (Company)
- 📚 **RISC-V Processor Design Tutorial** (Tutorial)
- 📊 **Chiplets and Heterogeneous Computing** (Industry)
- 🔬 **Quantum-Classical Hybrid Computing** (Research)

### **5. Rich Features**
- **Categories**: Technology, Industry, Company, Tutorial, Research
- **Tags**: Searchable and clickable tags
- **Author Information**: Name, role, avatar
- **Reading Time**: Auto-calculated
- **Related Posts**: By category
- **SEO Optimization**: Metadata and OpenGraph
- **Static Generation**: Pre-built pages for performance

## 🚀 **How to Add New Blog Posts**

To add a new blog post, developers simply:

1. **Add to the `blogPosts` array** in `src/lib/blog-content.ts`:
```typescript
{
  id: 'new-post-id',
  title: 'Your New Post Title',
  excerpt: 'Brief description...',
  content: `
# Your markdown content here
...
  `,
  author: {
    name: 'Author Name',
    role: 'Author Role'
  },
  publishDate: '2024-01-25',
  tags: ['tag1', 'tag2'],
  category: 'technology',
  slug: 'your-post-slug'
}
```

2. **That's it!** The blog system will automatically:
   - Generate the post page
   - Update category counts
   - Add tags to the tag system
   - Include in recent posts
   - Generate SEO metadata

## 🎯 **Access Your Blog**

Your blog is now live at:
- **Main Blog**: `http://localhost:3000/blog`
- **Individual Posts**: `http://localhost:3000/blog/[slug]`
- **Categories**: `http://localhost:3000/blog/category/[category]`
- **Tags**: `http://localhost:3000/blog/tag/[tag]`

The blog system is fully functional and ready to showcase your company's insights, tutorials, and industry expertise! 🎉 