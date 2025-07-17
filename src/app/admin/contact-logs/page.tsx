'use client';

import { useState, useEffect } from 'react';
import { Mail, Calendar, User, MessageSquare } from 'lucide-react';

interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

export default function ContactLogsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);

  useEffect(() => {
    // In a real application, this would fetch from a database
    // For now, we'll show a placeholder
    const mockSubmissions: ContactSubmission[] = [
      {
        name: 'Sudip Das',
        email: 'sudip.das1392001@gmail.com',
        subject: 'Silicon engineer',
        message: 'what the price',
        timestamp: '2025-07-01T20:17:31.893Z'
      }
    ];
    setSubmissions(mockSubmissions);
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Mail className="mr-3 text-primary-600" size={28} />
              Contact Form Submissions
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and review contact form submissions
            </p>
          </div>

          <div className="p-6">
            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Contact form submissions will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {submissions.map((submission, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <User className="text-gray-400 mr-2" size={16} />
                        <span className="font-medium text-gray-900">{submission.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="text-gray-400 mr-2" size={16} />
                        <span className="text-gray-600">{submission.email}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="text-gray-400 mr-2" size={16} />
                        <span className="font-medium text-gray-900">{submission.subject}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="text-gray-400 mr-2" size={16} />
                        <span className="text-gray-600">{formatDate(submission.timestamp)}</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Message:</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{submission.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Information */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">Local API</h3>
              <p className="text-sm text-green-600 mt-1">✅ Working - Logging to console</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-800">AWS Lambda</h3>
              <p className="text-sm text-yellow-600 mt-1">⏳ Not deployed yet</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800">Email Notifications</h3>
              <p className="text-sm text-blue-600 mt-1">🔄 Ready for AWS SES</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-2">How to Enable AWS Lambda</h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-1">
            <li>Follow the AWS_DEPLOYMENT.md guide</li>
            <li>Deploy using: <code className="bg-blue-100 px-2 py-1 rounded">sam deploy --guided</code></li>
            <li>Update .env.local with your API Gateway URL</li>
            <li>Configure AWS SES with your email addresses</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 