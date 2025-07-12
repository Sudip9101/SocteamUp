import { BlogContentManager, BlogPost } from '@/lib/blog-content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BlogContentManager.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BlogContentManager.getPostsByCategory(post.category)
    .filter(p => p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="mb-6">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {post.excerpt}
            </p>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{BlogContentManager.formatDate(post.publishDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author.name}</span>
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            {post.author.avatar && (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={56}
                height={56}
                className="rounded-full"
              />
            )}
            <div>
              <h3 className="font-medium text-gray-900">{post.author.name}</h3>
              <p className="text-gray-600">{post.author.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={675}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none blog-content">
            <BlogContent content={post.content} />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
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

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Related Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <RelatedPostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BlogContent({ content }: { content: string }) {
  // Convert markdown-style content to HTML-like structure
  const processedContent = content
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold text-gray-900 mb-4 mt-6">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-gray-900 mb-3 mt-5">$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-medium text-gray-900 mb-2 mt-4">$1</h4>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">$1</code>')
    .replace(/\n\n/g, '</p><p class="text-gray-700 mb-4 leading-relaxed">')
    .replace(/^\s*-\s+(.*$)/gm, '<li class="text-gray-700 mb-2">$1</li>')
    .replace(/(<li.*<\/li>)/g, '<ul class="list-disc pl-6 mb-4 space-y-1">$1</ul>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code class="text-sm">$2</code></pre>');

  return (
    <div 
      className="prose prose-lg max-w-none text-gray-700"
      dangerouslySetInnerHTML={{ __html: `<p class="text-gray-700 mb-4 leading-relaxed">${processedContent}</p>` }}
    />
  );
}

function RelatedPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`}>
        <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt={post.title}
              width={400}
              height={225}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          )}
        </div>
        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
          {post.title}
        </h4>
        <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{BlogContentManager.formatDate(post.publishDate)}</span>
          <span>{post.readTime} min read</span>
        </div>
      </Link>
    </article>
  );
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const posts = BlogContentManager.getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BlogContentManager.getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - SocTeamUp Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
} 