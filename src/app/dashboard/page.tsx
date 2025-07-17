'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Settings, 
  Download, 
  FileText, 
  BookOpen, 
  LogOut, 
  Bell,
  ChevronRight,
  Activity,
  Calendar,
  Mail,
  Shield
} from 'lucide-react';

interface UserData {
  userId: string;
  email: string;
  name: string;
  lastLogin: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
      return;
    }

    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Redirect to login
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                SocTeamUp
              </Link>
              <span className="ml-4 text-gray-500">Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Bell className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Last login: {formatLastLogin(user.lastLogin)}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <Activity className="h-5 w-5" />
              <span className="text-sm font-medium">Online</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/developers" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <BookOpen className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900">Developer Docs</h3>
                <p className="text-sm text-gray-600">Access development resources</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
            </div>
          </Link>

          <Link href="/contact" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <Mail className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-900">Contact</h3>
                <p className="text-sm text-gray-600">Get in touch with our team</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <Download className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900">Downloads</h3>
                <p className="text-sm text-gray-600">Software and tools</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
            </div>
          </div>

          <Link href="/settings" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <Settings className="h-8 w-8 text-gray-600 mb-3" />
                <h3 className="font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">Account preferences</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
            </div>
          </Link>
        </div>

        {/* User Info and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">Full Name</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                    <p className="text-sm text-gray-500">Email Address</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.userId}</p>
                    <p className="text-sm text-gray-500">User ID</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Successfully logged in</p>
                    <p className="text-xs text-gray-500">{formatLastLogin(user.lastLogin)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Account secure and verified</p>
                    <p className="text-xs text-gray-500">Security status updated</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Access to developer resources granted</p>
                    <p className="text-xs text-gray-500">Full documentation and tools available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/about" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              About SocTeamUp
            </Link>
            <Link href="/developers" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Developer Documentation
            </Link>
            <Link href="/contact" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Contact Support
            </Link>
            <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Return to Homepage
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 