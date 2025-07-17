'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download, Code, Book, FileText, Package, ExternalLink, Github, Settings, Cpu, Database, Zap } from 'lucide-react';
import { DeveloperContentManager, DownloadableFile, DocumentationSection } from '@/lib/developer-content';

// Get developer content from content management system
const developerContent: DocumentationSection[] = DeveloperContentManager.getAllSections();

export default function DevelopersPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const handleDownload = async (file: DownloadableFile) => {
    setIsDownloading(file.id);
    
    try {
      // Track the download using content manager
      DeveloperContentManager.trackDownload(file.id);
      
      // Open download URL
      window.open(file.s3Url, '_blank');
      
      // Simulate download delay for UX
      setTimeout(() => {
        setIsDownloading(null);
      }, 2000);
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(null);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'exe': return <Package className="w-5 h-5 text-blue-600" />;
      case 'pdf': return <FileText className="w-5 h-5 text-red-600" />;
      case 'zip': return <Download className="w-5 h-5 text-green-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const currentSection = developerContent.find(section => section.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Developer Resources
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to build with SocTeamUp. Tools, documentation, examples, and APIs 
                for semiconductor design and development.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <Code className="w-5 h-5 inline mr-2" />
                Documentation
              </h3>
              <nav className="space-y-2">
                {developerContent.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-500'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>

              {/* Quick Links */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h4>
                <div className="space-y-2">
                  <Link 
                    href="/contact" 
                    className="flex items-center text-sm text-gray-600 hover:text-primary-600"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Developer Support
                  </Link>
                  <Link 
                    href="#" 
                    className="flex items-center text-sm text-gray-600 hover:text-primary-600"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub Repository
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {currentSection && (
              <div className="bg-white rounded-lg shadow-sm">
                {/* Section Header */}
                <div className="px-8 py-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {currentSection.title}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {currentSection.description}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      Updated: {new Date(currentSection.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-8 py-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-600 mb-4">{currentSection.content}</p>
                  </div>

                  {/* Downloads Section */}
                  {currentSection.files && currentSection.files.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Download className="w-5 h-5 mr-2" />
                        Downloads
                      </h3>
                      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                        {currentSection.files.map((file) => (
                          <div
                            key={file.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                {getFileIcon(file.type)}
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">
                                    {file.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {file.description}
                                  </p>
                                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                    <span>v{file.version}</span>
                                    <span>{file.size}</span>
                                    <span>{new Date(file.releaseDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDownload(file)}
                                disabled={isDownloading === file.id}
                                className="flex items-center px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {isDownloading === file.id ? (
                                  <>
                                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                                    Downloading...
                                  </>
                                ) : (
                                  <>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 