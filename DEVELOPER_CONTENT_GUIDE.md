# Developer Content Management Guide

This guide explains how to manage content in the SocTeamUp developers section using a developer-friendly approach with code and markdown files.

## Overview

The developers section is designed to be **developer-managed**, meaning:
- **Content is version-controlled** in code/markdown files
- **Files are hosted on AWS S3** with direct download links
- **Everything is managed through code** - no CMS required
- **Easy to update** and maintain by developers

## Architecture

```
socteamup-website/
├── src/lib/developer-content.ts     # Content management system
├── src/app/developers/page.tsx      # Developers page component
├── content/developer-docs/          # Markdown content files
│   ├── getting-started.md
│   ├── api-documentation.md
│   └── design-tools.md
├── lambda/                          # AWS Lambda functions
└── template.yaml                    # AWS SAM infrastructure
```

## Content Management System

### 1. Content Structure

Each documentation section includes:
- **Metadata**: Title, description, category, tags
- **Markdown content**: Rich documentation with code examples
- **Downloadable files**: Links to S3 hosted files
- **Version tracking**: Last updated dates

### 2. File Types Supported

- **PDFs**: Documentation, guides, manuals
- **EXE files**: Windows installers and tools
- **ZIP archives**: Code examples, libraries
- **DEB packages**: Linux installers
- **TAR files**: Source code distributions

## Managing Content

### 1. Adding New Documentation

Create a new TypeScript section in `src/lib/developer-content.ts`:

```typescript
{
  id: 'new-section',
  title: 'New Documentation Section',
  description: 'Description of the new section',
  category: 'documentation', // 'documentation', 'tools', 'examples', 'api'
  lastUpdated: '2024-01-15',
  tags: ['tag1', 'tag2'],
  content: `
# Your Markdown Content Here

## Section 1
Content goes here...

## Code Examples
\`\`\`python
# Python code example
import socteamup
client = socteamup.Client()
\`\`\`
  
  files: [
    // Files array (see next section)
  ]
}


### 2. Adding Downloadable Files

#### Step 1: Upload to AWS S3

Upload your files to the S3 bucket with this structure:
```
socteamup-downloads/
├── dev-kit/                 # Development kits
├── docs/                    # Documentation PDFs
├── tools/                   # Software tools
├── examples/                # Example projects
├── libraries/               # Code libraries
└── sdk/                     # Software development kits
```

#### Step 2: Add File Metadata

```typescript
files: [
  {
    id: 'unique-file-id',
    name: 'Display Name',
    description: 'File description for users',
    version: '1.0.0',
    type: 'exe', // 'exe', 'pdf', 'zip', 'deb', 'tar', 'doc'
    size: '156 MB',
    s3Url: 'https://socteamup-downloads.s3.amazonaws.com/path/filename.exe',
    s3Bucket: 'socteamup-downloads',
    s3Key: 'path/filename.exe',
    releaseDate: '2024-01-15',
    category: 'Development Tools',
    platform: 'windows', // 'windows', 'linux', 'macos', 'all'
    checksum: 'sha256:hash...', // Optional
    minRequirements: 'Windows 10 64-bit, 8GB RAM' // Optional
  }
]
```

### 3. Content Categories

- **documentation**: Guides, tutorials, references
- **tools**: Software tools and utilities
- **examples**: Sample projects and code
- **api**: API documentation and SDKs

## AWS S3 File Management

### 1. S3 Bucket Structure

```
socteamup-downloads/
├── dev-kit/
│   ├── socteamup-dev-kit-v2.1.0-windows.exe
│   ├── socteamup-dev-kit-v2.1.0-linux.deb
│   └── socteamup-dev-kit-v2.1.0-macos.pkg
├── docs/
│   ├── quick-start-guide-v1.0.pdf
│   ├── api-reference-v3.2.pdf
│   └── tutorial-guide-v2.0.pdf
├── tools/
│   ├── socdesigner-pro-v4.5.2.exe
│   ├── cli-tools-v2.8.1.zip
│   └── postman-collection-v1.1.zip
├── examples/
│   ├── sample-projects-v1.2.zip
│   └── video-tutorials-v1.0.zip
├── libraries/
│   └── ip-cores-v1.4.0.zip
└── sdk/
    └── python-sdk-v2.0.1.zip
```

### 2. S3 Upload Script

Create an upload script for developers:

```bash
#!/bin/bash
# upload-to-s3.sh

BUCKET="socteamup-downloads"
REGION="us-east-1"

# Upload development kit
aws s3 cp socteamup-dev-kit-v2.1.0-windows.exe \
  s3://$BUCKET/dev-kit/ \
  --region $REGION \
  --acl public-read

# Upload documentation
aws s3 cp quick-start-guide-v1.0.pdf \
  s3://$BUCKET/docs/ \
  --region $REGION \
  --acl public-read

# Generate checksums
shasum -a 256 *.exe *.pdf > checksums.txt
aws s3 cp checksums.txt s3://$BUCKET/ --region $REGION --acl public-read
```

### 3. S3 Bucket Policy

Set up public read access for downloads:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::socteamup-downloads/*"
    }
  ]
}
```

## Version Management

### 1. File Versioning

Always include version numbers in filenames:
- `socteamup-dev-kit-v2.1.0-windows.exe`
- `api-reference-v3.2.pdf`
- `cli-tools-v2.8.1.zip`

### 2. Content Updates

When updating content:
1. Update the `lastUpdated` field
2. Increment version numbers for new files
3. Keep old versions for compatibility
4. Update documentation accordingly

### 3. Deprecation Process

For deprecated files:
1. Mark as deprecated in documentation
2. Add deprecation notice to file descriptions
3. Provide migration guide to new versions
4. Remove after sufficient notice period

## Advanced Features

### 1. Download Tracking

The system automatically tracks downloads:

```typescript
// In handleDownload function
DeveloperContentManager.trackDownload(file.id, userId);
```

Analytics data includes:
- File ID and name
- Download timestamp
- User ID (if available)
- User agent and IP

### 2. Platform Detection

Automatically suggest appropriate downloads:

```typescript
// Detect user platform
const platform = navigator.platform.toLowerCase();
const recommendedFiles = files.filter(f => 
  f.platform === 'all' || f.platform === platform
);
```

### 3. File Availability Checking

Verify S3 file existence:

```typescript
static async isFileAvailable(file: DownloadableFile): Promise<boolean> {
  try {
    const response = await fetch(file.s3Url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
```

## Deployment Workflow

### 1. Development Process

1. **Update Content**: Modify `developer-content.ts`
2. **Add Files**: Upload to S3 bucket
3. **Test Locally**: Run `npm run dev`
4. **Commit Changes**: Git commit and push
5. **Deploy**: Automatic deployment via CI/CD

### 2. Content Review Process

1. **Developer creates PR** with content changes
2. **Technical writer reviews** documentation
3. **QA tests** download links and functionality
4. **Manager approves** and merges
5. **Auto-deploy** to production

### 3. CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Deploy Developer Content
on:
  push:
    branches: [main]
    paths: ['src/lib/developer-content.ts', 'content/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to S3
        run: aws s3 sync ./content s3://socteamup-downloads/
      - name: Deploy Website
        run: npm run build && npm run deploy
```

## Best Practices

### 1. Content Guidelines

- **Use clear, concise language**
- **Include code examples** for all APIs
- **Provide platform-specific instructions**
- **Keep documentation up to date**
- **Use consistent formatting**

### 2. File Management

- **Use semantic versioning** (major.minor.patch)
- **Include checksums** for verification
- **Compress files** when appropriate
- **Test downloads** before publishing
- **Provide file descriptions** and requirements

### 3. Security Considerations

- **Scan all files** for malware before upload
- **Use HTTPS** for all download links
- **Verify file integrity** with checksums
- **Monitor download logs** for suspicious activity
- **Regular security audits** of S3 bucket

## Troubleshooting

### Common Issues

**Q: Download links return 403 Forbidden**
A: Check S3 bucket permissions and ensure files are publicly readable

**Q: File not found errors**
A: Verify S3 URLs and file existence, check for typos in file paths

**Q: Large files timeout**
A: Consider using S3 Transfer Acceleration or CDN

**Q: Version conflicts**
A: Implement proper version management and deprecation policies

### Support

- **Developer Documentation**: [Internal Wiki](wiki.socteamup.com/developers)
- **S3 Access**: Contact DevOps team
- **Content Questions**: Contact technical writing team
- **Emergency Support**: [24/7 Support Slack](slack://emergency)

---

This developer-managed content system ensures that all documentation and downloads are:
- ✅ **Version controlled**
- ✅ **Easy to maintain**
- ✅ **Scalable and performant**
- ✅ **Secure and reliable**
- ✅ **Developer-friendly** 