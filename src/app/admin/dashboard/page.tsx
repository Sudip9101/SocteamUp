'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  BarChart3, 
  Settings, 
  FileText, 
  Shield, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Database,
  Mail,
  Download,
  Eye,
  UserCheck,
  Clock,
  Globe,
  Server,
  Lock,
  LogOut,
  ArrowUp,
  ArrowDown,
  User
} from 'lucide-react';

interface UserData {
  userId: string;
  email: string;
  name: string;
  role: string;
  lastLogin: string;
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalDownloads: number;
  systemUptime: string;
  storageUsed: string;
  bandwidthUsed: string;
}

interface RecentActivity {
  id: string;
  type: 'login' | 'download' | 'registration' | 'error';
  user: string;
  action: string;
  timestamp: string;
  ip?: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and has admin role
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      
      // Check if user has admin role
      if (parsedUser.role !== 'admin') {
        // Redirect non-admin users to regular dashboard
        router.push('/dashboard');
        return;
      }
      
      setUser(parsedUser);
      loadDashboardData();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
      return;
    }

    setIsLoading(false);
  }, [router]);

  const loadDashboardData = () => {
    // Mock dashboard data - in production, this would come from APIs
    setStats({
      totalUsers: 1247,
      activeUsers: 342,
      totalDownloads: 8934,
      systemUptime: '99.9%',
      storageUsed: '67.3 GB',
      bandwidthUsed: '2.4 TB'
    });

    setRecentActivity([
      {
        id: '1',
        type: 'login',
        user: 'john.doe@example.com',
        action: 'Successfully logged in',
        timestamp: '2 minutes ago',
        ip: '192.168.1.100'
      },
      {
        id: '2',
        type: 'download',
        user: 'jane.smith@example.com',
        action: 'Downloaded SDK v2.1.0',
        timestamp: '5 minutes ago',
        ip: '10.0.0.45'
      },
      {
        id: '3',
        type: 'registration',
        user: 'bob.wilson@example.com',
        action: 'New user registration',
        timestamp: '12 minutes ago',
        ip: '172.16.0.23'
      },
      {
        id: '4',
        type: 'error',
        user: 'system',
        action: 'Failed login attempt',
        timestamp: '18 minutes ago',
        ip: '203.0.113.42'
      },
      {
        id: '5',
        type: 'login',
        user: 'alice.brown@example.com',
        action: 'Successfully logged in',
        timestamp: '25 minutes ago',
        ip: '198.51.100.15'
      }
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <UserCheck className="h-4 w-4 text-green-600" />;
      case 'download':
        return <Download className="h-4 w-4 text-blue-600" />;
      case 'registration':
        return <User className="h-4 w-4 text-purple-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'login':
        return 'bg-green-50 border-green-200';
      case 'download':
        return 'bg-blue-50 border-blue-200';
      case 'registration':
        return 'bg-purple-50 border-purple-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600 mr-8">
                SocTeamUp
              </Link>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-red-600" />
                <span className="text-lg font-semibold text-gray-900">Admin Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <div className="text-xs text-red-600 font-medium">Administrator</div>
                </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'users', name: 'User Management', icon: Users },
              { id: 'content', name: 'Content', icon: FileText },
              { id: 'system', name: 'System', icon: Server },
              { id: 'security', name: 'Security', icon: Lock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">12% from last month</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.activeUsers.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">8% from last week</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Downloads</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalDownloads.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Download className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">23% from last month</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Uptime</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.systemUptime}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-gray-600">Last 30 days</span>
                </div>
              </div>
            </div>

            {/* Recent Activity and System Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className={`flex items-center p-3 rounded-lg border ${getActivityBgColor(activity.type)}`}
                      >
                        <div className="flex-shrink-0 mr-3">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <div className="flex items-center mt-1 space-x-2">
                            <p className="text-xs text-gray-500">{activity.user}</p>
                            <span className="text-xs text-gray-400">•</span>
                            <p className="text-xs text-gray-500">{activity.timestamp}</p>
                            {activity.ip && (
                              <>
                                <span className="text-xs text-gray-400">•</span>
                                <p className="text-xs text-gray-500">{activity.ip}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link
                      href="/admin/auth-logs"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View all activity logs →
                    </Link>
                  </div>
                </div>
              </div>

              {/* System Resources */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">System Resources</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Database className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Storage Used</p>
                          <p className="text-xs text-gray-500">Total: 100 GB</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{stats?.storageUsed}</p>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Bandwidth Used</p>
                          <p className="text-xs text-gray-500">This month</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{stats?.bandwidthUsed}</p>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Server className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Server Status</p>
                          <p className="text-xs text-gray-500">All systems operational</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-green-600">Online</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/admin/auth-logs"
                  className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Eye className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-blue-900">View Auth Logs</span>
                </Link>
                
                <Link
                  href="/admin/contact-logs"
                  className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Mail className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-green-900">Contact Messages</span>
                </Link>
                
                <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <Users className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium text-purple-900">Manage Users</span>
                </button>
                
                <button className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  <Settings className="h-5 w-5 text-orange-600 mr-3" />
                  <span className="text-sm font-medium text-orange-900">System Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content would go here */}
        {activeTab !== 'overview' && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h3>
            <p className="text-gray-600">
              This section is under development. Advanced {activeTab} management features will be available soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 