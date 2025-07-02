'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Github, Chrome, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Get API URL from environment or use local endpoints
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = isLogin 
        ? (apiUrl ? `${apiUrl}/api/auth/login` : '/api/auth/login')
        : (apiUrl ? `${apiUrl}/api/auth/register` : '/api/auth/register');

      const requestData = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            name: formData.name,
            email: formData.email, 
            password: formData.password,
            confirmPassword: formData.confirmPassword
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      // Success
      setSubmitStatus('success');
      
      // Store token in localStorage (in production, consider more secure storage)
      if (result.token) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
      }

      // Reset form
      setFormData({ email: '', password: '', confirmPassword: '', name: '' });
      
      // Show success message for 3 seconds then redirect or reset
      setTimeout(() => {
        setSubmitStatus('idle');
        // In a real app, you might redirect to dashboard
        // window.location.href = '/dashboard';
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      
      // Reset error message after 10 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
      }, 10000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Get Google auth URL
      const response = await fetch('/api/auth/google/auth-url', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get Google auth URL');
      }

      // Check if this is a development mock URL
      if (result.authUrl.includes('google_auth=true')) {
        // Handle mock Google authentication for development
        const urlParams = new URLSearchParams(result.authUrl.split('?')[1]);
        const mockCode = urlParams.get('code');
        
        if (mockCode) {
          // Simulate OAuth callback with mock code
          const callbackResponse = await fetch('/api/auth/google/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: mockCode }),
          });

          const callbackResult = await callbackResponse.json();

          if (!callbackResponse.ok) {
            throw new Error(callbackResult.error || 'Google authentication failed');
          }

          // Success
          setSubmitStatus('success');
          
          // Store token and user info
          if (callbackResult.token) {
            localStorage.setItem('authToken', callbackResult.token);
            localStorage.setItem('user', JSON.stringify(callbackResult.user));
          }

          // Reset form
          setFormData({ email: '', password: '', confirmPassword: '', name: '' });
          
          // Show success message for 3 seconds
          setTimeout(() => {
            setSubmitStatus('idle');
            // In a real app, redirect to dashboard
            // window.location.href = '/dashboard';
          }, 3000);
        }
      } else {
        // Redirect to real Google OAuth URL
        window.location.href = result.authUrl;
      }

    } catch (error) {
      console.error('Error with Google login:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Google authentication failed');
      
      setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
      }, 10000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
      handleGoogleLogin();
    } else {
      // TODO: Implement other OAuth providers
      alert(`${provider} login will be integrated with serverless functions`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Sign in to your SocTeamUp account' : 'Join the SocTeamUp community'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Demo Credentials (Development Only) */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials (Development)</h4>
            <p className="text-sm text-blue-700">
              <strong>Email:</strong> demo@socteamup.com<br />
              <strong>Password:</strong> password123
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin('Google')}
              disabled={isSubmitting}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Chrome className="w-5 h-5 mr-2" />
              )}
              {isSubmitting ? 'Connecting...' : 'Continue with Google'}
            </button>
            <button
              onClick={() => handleSocialLogin('GitHub')}
              disabled={isSubmitting}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Github className="w-5 h-5 mr-2" />
              Continue with GitHub
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Login/Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-black"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-black"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-black"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isLogin}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-black"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            )}

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="flex items-center p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50">
                <CheckCircle className="flex-shrink-0 w-4 h-4 mr-2" />
                <span className="text-sm font-medium">
                  {isLogin ? 'Login successful! Welcome back.' : 'Registration successful! Welcome to SocTeamUp.'}
                </span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="flex items-center p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50">
                <XCircle className="flex-shrink-0 w-4 h-4 mr-2" />
                <div className="text-sm">
                  <span className="font-medium">Error: </span>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Authentication powered by serverless functions and secure JWT tokens
        </p>
      </div>
    </div>
  );
} 