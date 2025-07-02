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

// Mock users for development (this should be retrieved from database in production)
const getMockUsers = () => [
  {
    userId: 'user_demo',
    name: 'Demo User',
    email: 'demo@socteamup.com',
    password: 'password123', // In production, this would be hashed
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

// Input validation
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Handle POST requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Basic validation
    const errors: string[] = [];

    if (!email || !validateEmail(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400, headers: corsHeaders }
      );
    }

    // Get users (in production, query from database)
    const users = getMockUsers();

    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Verify password (in production, use bcrypt.compare)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Log successful login
    console.log('User login successful:', {
      userId: user.userId,
      email: user.email,
      timestamp: new Date().toISOString(),
    });

    // Simulate JWT token (in production, use proper JWT library)
    const mockToken = `mock_jwt_${user.userId}_${Date.now()}`;

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful!',
        token: mockToken,
        user: {
          userId: user.userId,
          email: user.email,
          name: user.name,
          lastLogin: new Date().toISOString(),
        },
      },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error processing login:', error);
    
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