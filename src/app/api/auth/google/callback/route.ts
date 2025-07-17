import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // For local development, handle callback directly
    if (process.env.NODE_ENV === 'development') {
      const { code } = data;
      
      if (!code) {
        return NextResponse.json(
          { error: 'Authorization code is required' },
          { status: 400 }
        );
      }

      // Mock Google OAuth response for development
      const mockGoogleUser = {
        id: 'google_' + Math.random().toString(36).substr(2, 9),
        email: 'testuser@gmail.com',
        name: 'Test Google User',
        picture: 'https://via.placeholder.com/100',
        verified_email: true
      };

      // Generate mock JWT token
      const token = 'jwt_' + Math.random().toString(36).substr(2, 20);

      console.log('Google OAuth callback (development):', {
        user: mockGoogleUser,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        message: 'Google authentication successful!',
        token,
        user: {
          userId: mockGoogleUser.id,
          email: mockGoogleUser.email,
          name: mockGoogleUser.name,
          picture: mockGoogleUser.picture,
          provider: 'google',
          isVerified: true,
          lastLogin: new Date().toISOString()
        }
      });
    }

    // For production, proxy to Lambda function
    const lambdaUrl = process.env.GOOGLE_AUTH_LAMBDA_URL;
    if (!lambdaUrl) {
      return NextResponse.json(
        { error: 'Google authentication service not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`${lambdaUrl}/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in Google OAuth callback:', error);
    
    return NextResponse.json(
      { 
        error: 'Google authentication failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 