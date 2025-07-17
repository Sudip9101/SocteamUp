import { NextRequest, NextResponse } from 'next/server';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Simple in-memory storage for development (use database in production)
const users: any[] = [];

// Input validation
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 8;
};

// Handle POST requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, confirmPassword } = body;

    // Basic validation
    const errors: string[] = [];

    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!email || !validateEmail(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!password || !validatePassword(password)) {
      errors.push('Password must be at least 8 characters long');
    }

    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email address' },
        { status: 409, headers: corsHeaders }
      );
    }

    // Create new user (in production, hash password and save to database)
    const newUser = {
      userId: `user_${Date.now()}`,
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    users.push({ ...newUser, password }); // In production, hash this password

    // Log registration (in production, this would be sent to AWS SES)
    console.log('User registration:', {
      userId: newUser.userId,
      name: newUser.name,
      email: newUser.email,
      timestamp: newUser.createdAt,
    });

    // Simulate JWT token (in production, use proper JWT library)
    const mockToken = `mock_jwt_${newUser.userId}_${Date.now()}`;

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful!',
        token: mockToken,
        user: {
          userId: newUser.userId,
          email: newUser.email,
          name: newUser.name,
          createdAt: newUser.createdAt,
        },
      },
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error processing registration:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: corsHeaders }
  );
} 