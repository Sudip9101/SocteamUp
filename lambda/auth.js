/**
 * AWS Lambda function for user authentication
 * Handles registration, login, JWT token generation, and user management
 */

const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES({ region: 'us-east-1' });

// CORS headers for frontend integration
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'https://socteamup.com',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
};

// Input validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validateInput = (data, type) => {
  const errors = [];

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Please provide a valid email address');
  }

  if (!data.password || data.password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (type === 'register') {
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!validatePassword(data.password)) {
      errors.push('Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number');
    }

    if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }
  }

  return errors;
};

// Generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Check if user exists
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

// Create new user
const createUser = async (userData) => {
  const userId = uuidv4();
  const hashedPassword = await bcrypt.hash(userData.password, 12);

  const user = {
    userId,
    email: userData.email,
    name: userData.name,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    isVerified: false,
    loginCount: 0,
    lastLogin: null
  };

  const params = {
    TableName: process.env.USERS_TABLE,
    Item: user
  };

  await dynamodb.put(params).promise();
  
  // Remove password from response
  delete user.password;
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

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  const emailParams = {
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Html: {
          Data: `
            <h2>Welcome to SocTeamUp!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for joining SocTeamUp! We're excited to have you as part of our semiconductor design community.</p>
            <p>Here's what you can do next:</p>
            <ul>
              <li>Explore our developer documentation</li>
              <li>Check out our latest semiconductor solutions</li>
              <li>Connect with our team for custom projects</li>
            </ul>
            <p>If you have any questions, feel free to reach out to us anytime.</p>
            <p>Best regards,<br>The SocTeamUp Team</p>
            <hr>
            <p><small>Visit us at <a href="${process.env.FRONTEND_URL}">socteamup.com</a></small></p>
          `
        },
        Text: {
          Data: `
            Welcome to SocTeamUp!
            
            Hi ${name},
            
            Thank you for joining SocTeamUp! We're excited to have you as part of our semiconductor design community.
            
            Here's what you can do next:
            - Explore our developer documentation
            - Check out our latest semiconductor solutions
            - Connect with our team for custom projects
            
            If you have any questions, feel free to reach out to us anytime.
            
            Best regards,
            The SocTeamUp Team
            
            Visit us at ${process.env.FRONTEND_URL}
          `
        }
      },
      Subject: {
        Data: 'Welcome to SocTeamUp!'
      }
    },
    Source: process.env.FROM_EMAIL || 'noreply@socteamup.com'
  };

  return ses.sendEmail(emailParams).promise();
};

// Handle user registration
const handleRegister = async (data) => {
  // Validate input
  const validationErrors = validateInput(data, 'register');
  if (validationErrors.length > 0) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Validation failed',
        details: validationErrors
      })
    };
  }

  // Check if user already exists
  const existingUser = await getUserByEmail(data.email);
  if (existingUser) {
    return {
      statusCode: 409,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'User already exists with this email address'
      })
    };
  }

  // Create new user
  const user = await createUser(data);
  
  // Generate JWT token
  const token = generateToken(user.userId, user.email);

  // Send welcome email
  try {
    await sendWelcomeEmail(user.email, user.name);
  } catch (emailError) {
    console.error('Failed to send welcome email:', emailError);
    // Don't fail registration if email fails
  }

  return {
    statusCode: 201,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    })
  };
};

// Handle user login
const handleLogin = async (data) => {
  // Validate input
  const validationErrors = validateInput(data, 'login');
  if (validationErrors.length > 0) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Validation failed',
        details: validationErrors
      })
    };
  }

  // Get user by email
  const user = await getUserByEmail(data.email);
  if (!user) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Invalid email or password'
      })
    };
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(data.password, user.password);
  if (!isValidPassword) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Invalid email or password'
      })
    };
  }

  // Update login info
  await updateUserLogin(user.userId);

  // Generate JWT token
  const token = generateToken(user.userId, user.email);

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        lastLogin: new Date().toISOString()
      }
    })
  };
};

// Handle token verification
const handleVerify = async (event) => {
  const authHeader = event.headers.Authorization || event.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Missing or invalid authorization header'
      })
    };
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const decoded = verifyToken(token);

  if (!decoded) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Invalid or expired token'
      })
    };
  }

  // Get current user data
  const user = await getUserByEmail(decoded.email);
  if (!user) {
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'User not found'
      })
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      valid: true,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        lastLogin: user.lastLogin
      }
    })
  };
};

// Main Lambda handler
exports.handler = async (event) => {
  console.log('Auth request received:', JSON.stringify(event, null, 2));

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
    if (method === 'POST' && path.includes('/register')) {
      const data = JSON.parse(event.body);
      return await handleRegister(data);
    }
    
    if (method === 'POST' && path.includes('/login')) {
      const data = JSON.parse(event.body);
      return await handleLogin(data);
    }
    
    if (method === 'GET' && path.includes('/verify')) {
      return await handleVerify(event);
    }

    // Invalid route
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Route not found' })
    };

  } catch (error) {
    console.error('Error processing auth request:', error);

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