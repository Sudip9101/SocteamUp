import { BlogContentManager, BlogPost } from '@/lib/blog-content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Folder } from 'lucide-react';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const posts = BlogContentManager.getPostsByCategory(params.category);
  const categories = BlogContentManager.getCategories();
  const currentCategory = categories.find(cat => cat.id === params.category);

  if (!currentCategory || posts.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Folder className="w-6 h-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {currentCategory.name}
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-4">
            {currentCategory.description}
          </p>
          <p className="text-sm text-gray-500">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this category
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {posts.map((post, index) => (
                <div 
                  key={post.id}
                  className="animate-slideInLeft"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Other Categories */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Categories</h3>
                <div className="space-y-2">
                  {categories
                    .filter(cat => cat.id !== params.category)
                    .map((category) => (
                      <Link
                        key={category.id}
                        href={`/blog/category/${category.id}`}
                        className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-700">{category.name}</span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {category.count}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-white rounded-lg shadow-sm p-6 blog-card">
      <div className="flex items-center gap-4 mb-3">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
          {post.category}
        </span>
        <span className="text-sm text-gray-500">
          {BlogContentManager.formatDate(post.publishDate)}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
        <Link href={`/blog/${post.slug}`}>
          {post.title}
        </Link>
      </h3>
      <p className="text-gray-600 mb-4">{post.excerpt}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {post.author.avatar && (
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
            <p className="text-xs text-gray-500">{post.author.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{post.readTime} min read</span>
          <Link
            href={`/blog/${post.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Read more →
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {post.tags.slice(0, 3).map((tag) => (
          <Link
            key={tag}
            href={`/blog/tag/${encodeURIComponent(tag)}`}
            className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full blog-tag"
          >
            {tag}
          </Link>
        ))}
      </div>
    </article>
  );
}

// Generate static paths for all categories
export async function generateStaticParams() {
  const categories = BlogContentManager.getCategories();
  return categories.map((category) => ({
    category: category.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps) {
  const categories = BlogContentManager.getCategories();
  const currentCategory = categories.find(cat => cat.id === params.category);
  
  if (!currentCategory) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${currentCategory.name} - SocTeamUp Blog`,
    description: currentCategory.description,
  };
} 