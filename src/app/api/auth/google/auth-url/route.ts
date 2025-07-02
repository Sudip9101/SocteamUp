import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // For local development, generate mock auth URL
    if (process.env.NODE_ENV === 'development') {
      const mockAuthUrl = `${request.nextUrl.origin}/login?google_auth=true&code=mock_auth_code_${Date.now()}`;
      
      console.log('Generated Google auth URL (development):', mockAuthUrl);
      
      return NextResponse.json({
        authUrl: mockAuthUrl,
        message: 'Mock Google authentication URL for development'
      });
    }

    // For production, proxy to Lambda function or generate real Google OAuth URL
    const lambdaUrl = process.env.GOOGLE_AUTH_LAMBDA_URL;
    if (!lambdaUrl) {
      // Generate Google OAuth URL directly if Lambda URL not configured
      const googleClientId = process.env.GOOGLE_CLIENT_ID;
      const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${request.nextUrl.origin}/api/auth/google/callback`;
      
      if (!googleClientId) {
        return NextResponse.json(
          { error: 'Google OAuth not configured' },
          { status: 500 }
        );
      }

      const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      const params = new URLSearchParams({
        client_id: googleClientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent'
      });

      const authUrl = `${baseUrl}?${params.toString()}`;
      
      return NextResponse.json({
        authUrl,
        message: 'Redirect user to this URL for Google authentication'
      });
    }

    // Proxy to Lambda function
    const response = await fetch(`${lambdaUrl}/google/auth-url`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate Google authentication URL',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 