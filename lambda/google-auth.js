/**
 * AWS Lambda function for Google OAuth authentication
 * Handles Google OAuth flow, token verification, and user management
 */

const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const https = require('https');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES({ region: 'us-east-1' });

// CORS headers for frontend integration
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'https://socteamup.com',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
};

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// Generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email, provider: 'google' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify Google OAuth token
const verifyGoogleToken = async (accessToken) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.googleapis.com',
      path: `/oauth2/v2/userinfo?access_token=${accessToken}`,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const userInfo = JSON.parse(data);
          if (res.statusCode === 200 && userInfo.id) {
            resolve(userInfo);
          } else {
            reject(new Error('Invalid Google token'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

// Exchange authorization code for access token
const exchangeCodeForToken = async (code) => {
  const postData = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: GOOGLE_REDIRECT_URI
  }).toString();

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const tokenData = JSON.parse(data);
          if (res.statusCode === 200 && tokenData.access_token) {
            resolve(tokenData);
          } else {
            reject(new Error('Failed to exchange code for token'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
};

// Check if user exists by Google ID
const getUserByGoogleId = async (googleId) => {
  const params = {
    TableName: process.env.USERS_TABLE,
    IndexName: 'googleId-index',
    KeyConditionExpression: 'googleId = :googleId',
    ExpressionAttributeValues: {
      ':googleId': googleId
    }
  };

  try {
    const result = await dynamodb.query(params).promise();
    return result.Items.length > 0 ? result.Items[0] : null;
  } catch (error) {
    console.error('Error querying user by Google ID:', error);
    return null;
  }
};

// Check if user exists by email
const getUserByEmail = async (email) => {
  const params = {
    TableName: process.env.USERS_TABLE,
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };

  const result = await dynamodb.query(params).promise();
  return result.Items.length > 0 ? result.Items[0] : null;
};

// Create new user from Google OAuth
const createGoogleUser = async (googleUserInfo) => {
  const userId = uuidv4();

  const user = {
    userId,
    email: googleUserInfo.email,
    name: googleUserInfo.name,
    googleId: googleUserInfo.id,
    picture: googleUserInfo.picture,
    provider: 'google',
    isVerified: true, // Google accounts are pre-verified
    createdAt: new Date().toISOString(),
    loginCount: 1,
    lastLogin: new Date().toISOString()
  };

  const params = {
    TableName: process.env.USERS_TABLE,
    Item: user
  };

  await dynamodb.put(params).promise();
  return user;
};

// Update user login info
const updateUserLogin = async (userId) => {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: { userId },
    UpdateExpression: 'SET lastLogin = :lastLogin, loginCount = loginCount + :inc',
    ExpressionAttributeValues: {
      ':lastLogin': new Date().toISOString(),
      ':inc': 1
    }
  };

  await dynamodb.update(params).promise();
};

// Main Lambda handler
exports.handler = async (event) => {
  console.log('Google Auth request received:', JSON.stringify(event, null, 2));

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const path = event.path || event.rawPath;
    const method = event.httpMethod;

    // Route handling
    if (method === 'GET' && path.includes('/google/auth-url')) {
      const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent'
      });
      
      const authUrl = `${baseUrl}?${params.toString()}`;
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ authUrl })
      };
    }
    
    if (method === 'POST' && path.includes('/google/callback')) {
      const data = JSON.parse(event.body || '{}');
      const { code } = data;

      if (!code) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Authorization code is required' })
        };
      }

      try {
        // Exchange authorization code for access token
        const tokenData = await exchangeCodeForToken(code);
        
        // Get user info from Google
        const googleUserInfo = await verifyGoogleToken(tokenData.access_token);
        
        console.log('Google user info:', googleUserInfo);

        // Check if user already exists with this Google ID
        let user = await getUserByGoogleId(googleUserInfo.id);
        
        if (user) {
          // User exists, update login info
          await updateUserLogin(user.userId);
        } else {
          // Check if user exists with this email (from regular registration)
          user = await getUserByEmail(googleUserInfo.email);
          
          if (user) {
            // Link Google account to existing user
            const params = {
              TableName: process.env.USERS_TABLE,
              Key: { userId: user.userId },
              UpdateExpression: 'SET googleId = :googleId, picture = :picture, isVerified = :isVerified',
              ExpressionAttributeValues: {
                ':googleId': googleUserInfo.id,
                ':picture': googleUserInfo.picture,
                ':isVerified': true
              }
            };
            
            await dynamodb.update(params).promise();
            await updateUserLogin(user.userId);
            user.googleId = googleUserInfo.id;
            user.picture = googleUserInfo.picture;
          } else {
            // Create new user
            user = await createGoogleUser(googleUserInfo);
          }
        }

        // Generate JWT token
        const token = generateToken(user.userId, user.email);

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            message: 'Google authentication successful!',
            token,
            user: {
              userId: user.userId,
              email: user.email,
              name: user.name,
              picture: user.picture,
              provider: 'google',
              isVerified: true,
              lastLogin: new Date().toISOString()
            }
          })
        };

      } catch (error) {
        console.error('Google OAuth error:', error);
        
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({
            error: 'Google authentication failed',
            message: error.message
          })
        };
      }
    }

    // Invalid route
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Route not found' })
    };

  } catch (error) {
    console.error('Error processing Google auth request:', error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
}; 