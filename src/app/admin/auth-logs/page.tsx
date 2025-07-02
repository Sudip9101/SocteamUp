'use client';

import { useState, useEffect } from 'react';
import { User, Shield, Calendar, Activity, Key } from 'lucide-react';

interface AuthActivity {
  type: 'login' | 'register';
  userId: string;
  email: string;
  name?: string;
  timestamp: string;
  success: boolean;
}

export default function AuthLogsPage() {
  const [activities, setActivities] = useState<AuthActivity[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    todayLogins: 0,
    todayRegistrations: 0,
  });

  useEffect(() => {
    // In a real application, this would fetch from a database
    // For now, we'll show mock data
    const mockActivities: AuthActivity[] = [
      {
        type: 'login',
        userId: 'user_demo',
        email: 'demo@socteamup.com',
        name: 'Demo User',
        timestamp: new Date().toISOString(),
        success: true
      }
    ];
    
    setActivities(mockActivities);
    setStats({
      totalUsers: 1,
      todayLogins: 1,
      todayRegistrations: 0,
    });
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActivityIcon = (type: string, success: boolean) => {
    if (type === 'login') {
      return <Key className={`w-4 h-4 ${success ? 'text-green-600' : 'text-red-600'}`} />;
    } else {
      return <User className={`w-4 h-4 ${success ? 'text-blue-600' : 'text-red-600'}`} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="mr-3 text-primary-600" size={32} />
            Authentication Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor user authentication activities and system status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Key className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Today's Logins</h3>
                <p className="text-3xl font-bold text-green-600">{stats.todayLogins}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">New Registrations</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.todayRegistrations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Activity className="mr-2 text-primary-600" size={24} />
              Recent Authentication Activities
            </h2>
          </div>

          <div className="p-6">
            {activities.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No activities yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Authentication activities will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center space-x-4">
                      {getActivityIcon(activity.type, activity.success)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {activity.name || 'Unknown User'}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({activity.email})
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {activity.type === 'login' ? 'Signed in' : 'Registered'} • 
                          <span className={activity.success ? 'text-green-600' : 'text-red-600'}>
                            {activity.success ? ' Success' : ' Failed'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Authentication System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">Local API</h3>
              <p className="text-sm text-green-600 mt-1">✅ Registration & Login working</p>
              <p className="text-xs text-green-500 mt-1">Demo user: demo@socteamup.com</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-800">AWS Lambda</h3>
              <p className="text-sm text-yellow-600 mt-1">⏳ Ready for deployment</p>
              <p className="text-xs text-yellow-500 mt-1">Includes DynamoDB + JWT + SES</p>
            </div>
          </div>
        </div>

        {/* Test Credentials */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-4">Test Authentication</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Login Test</h4>
              <p className="text-sm text-blue-700">
                <strong>Email:</strong> demo@socteamup.com<br />
                <strong>Password:</strong> password123
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Registration Test</h4>
              <p className="text-sm text-blue-700">
                Use any email and password (8+ chars)<br />
                Will show in activities above
              </p>
            </div>
          </div>
        </div>

        {/* AWS Deployment Instructions */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-medium text-purple-900 mb-2">Deploy to AWS Lambda</h3>
          <ol className="list-decimal list-inside text-purple-800 space-y-1 text-sm">
            <li>Run: <code className="bg-purple-100 px-2 py-1 rounded">sam build</code></li>
            <li>Deploy: <code className="bg-purple-100 px-2 py-1 rounded">sam deploy --guided</code></li>
            <li>Update environment variables with API Gateway URL</li>
            <li>Configure AWS SES for email notifications</li>
            <li>Real authentication with DynamoDB storage</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 