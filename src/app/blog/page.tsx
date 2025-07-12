import { BlogContentManager, BlogPost } from '@/lib/blog-content';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPage() {
  const featuredPosts = BlogContentManager.getFeaturedPosts();
  const recentPosts = BlogContentManager.getRecentPosts(10);
  const categories = BlogContentManager.getCategories();
  const allTags = BlogContentManager.getAllTags();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center animate-slideInDown">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              SocTeamUp Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Insights, tutorials, and updates from the world of semiconductor design and technology.
              Stay informed about the latest developments in chip design, industry trends, and our company news.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredPosts.map((post, index) => (
                    <div 
                      key={post.id}
                      className="animate-slideInUp"
                      style={{ 
                        animationDelay: `${index * 0.2}s`,
                        animationFillMode: 'both'
                      }}
                    >
                      <FeaturedBlogCard post={post} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recent Posts */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Posts</h2>
              <div className="space-y-8">
                {recentPosts.map((post, index) => (
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
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Categories */}
              <div className="bg-white rounded-lg shadow-sm p-6 animate-slideInRight" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
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

              {/* Popular Tags */}
              <div className="bg-white rounded-lg shadow-sm p-6 animate-slideInRight" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 15).map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${encodeURIComponent(tag)}`}
                      className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full blog-tag"
                    >
                      {tag}
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

function FeaturedBlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden featured-blog-card">
      {post.coverImage && (
        <div className="aspect-video bg-gray-200 relative">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover featured-blog-image"
          />
        </div>
      )}
      <div className="p-6">
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
          <span className="text-sm text-gray-500">{post.readTime} min read</span>
        </div>
      </div>
    </article>
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