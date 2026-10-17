import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPostBySlug } from '@/lib/actions/blog.actions';
import { formatDateTime } from '@/lib/utils';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_URL } from '@/lib/constants';
import BlogContentRenderer from '@/components/blog/blog-content-renderer';

export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBlogPostBySlug(slug);

  if (!result.success || !result.post) {
    return {
      title: 'Article Not Found | Madhav Shringaar',
    };
  }

  const post = result.post;
  const postUrl = `${APP_URL}/blogs/${post.slug}`;

  return {
    title: post.metaTitle || `${post.title} | Madhav Shringaar`,
    description: post.metaDescription || post.excerpt,
    keywords: post.tags?.length ? post.tags : ['Laddu Gopal seva', 'Krishna poshak', 'Madhav Shringaar blog'],
    alternates: {
      canonical: `/blogs/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || post.metaDescription,
      url: postUrl,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName || 'Madhav Shringaar'],
      images: [
        {
          url: post.featuredImage || '/images/devotional/complete_shringar.webp',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage || '/images/devotional/complete_shringar.webp'],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const result = await getBlogPostBySlug(slug);

  if (!result.success || !result.post) {
    notFound();
  }

  const { post, relatedPosts = [] } = result;
  const postUrl = `${APP_URL}/blogs/${post.slug}`;
  const shareText = encodeURIComponent(`Read this sacred seva guide from Madhav Shringaar: "${post.title}" - ${postUrl}`);

  return (
    <article className="min-h-screen bg-[#FAF8F5] text-neutral-800 pb-24">
      {/* 1. GOOGLE ARTICLE JSON-LD SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            image: post.featuredImage ? `${APP_URL}${post.featuredImage}` : `${APP_URL}/images/devotional/complete_shringar.webp`,
            datePublished: post.publishedAt || post.createdAt,
            dateModified: post.updatedAt,
            author: {
              '@type': 'Organization',
              name: post.authorName || 'Madhav Shringaar',
              url: APP_URL,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Madhav Shringaar',
              logo: {
                '@type': 'ImageObject',
                url: `${APP_URL}/images/logo.png`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': postUrl,
            },
          }),
        }}
      />

      {/* 2. TOP BREADCRUMB & HEADER */}
      <section className="bg-gradient-to-b from-[#FAF4E6] to-[#FDFBF7] border-b border-[#E6C16A]/20 pt-10 pb-12">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          {/* Breadcrumb & Back */}
          <div className="flex items-center justify-between text-xs text-neutral-500 font-sans">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1.5 text-[#003020] hover:text-[#C88A20] font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Articles
            </Link>
            <div className="hidden sm:flex items-center gap-1.5">
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <Link href="/blogs" className="hover:underline">Blogs</Link>
              <span>/</span>
              <span className="text-[#C88A20] truncate max-w-[200px]">{post.category}</span>
            </div>
          </div>

          {/* Category Badge */}
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#E6C16A]/20 border border-[#E6C16A]/50 text-[#8A5A0A] text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#003020] leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Byline & Metadata Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#003020]/10 text-xs text-neutral-600">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-[#003020]">
                <User className="w-3.5 h-3.5 text-[#C88A20]" />
                {post.authorName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0F6F74]" />
                {formatDateTime(new Date(post.publishedAt || post.createdAt)).dateOnly}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C88A20]" />
                {post.readingTime || 3} min read
              </span>
            </div>

            {/* Share on WhatsApp */}
            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white font-semibold transition-all shadow-2xs text-xs"
              title="Share with Devotees on WhatsApp"
            >
              <Share2 className="w-3 h-3" /> Share Guide
            </a>
          </div>
        </div>
      </section>

      {/* 3. COVER IMAGE & ARTICLE BODY */}
      <section className="max-w-4xl mx-auto px-6 pt-10">
        {/* Featured Cover Image */}
        {post.featuredImage && (
          <div className="relative w-full h-[260px] sm:h-[400px] md:h-[460px] aspect-video rounded-3xl overflow-hidden shadow-xl border-4 border-white mb-12">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              loading="eager"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        )}

        {/* Lead Excerpt */}
        {post.excerpt && (
          <div className="p-6 rounded-2xl bg-[#FAF4E6] border border-[#E6C16A]/40 mb-10 text-base md:text-lg font-serif italic text-neutral-800 leading-relaxed">
            &ldquo;{post.excerpt}&rdquo;
          </div>
        )}

        {/* Article Body Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-neutral-200/80 shadow-xs max-w-3xl mx-auto">
          <BlogContentRenderer content={post.content} />
        </div>

        {/* Devotional Tags Strip */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-[#003020]/10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Devotional Tags:</span>
            {post.tags.map((tag: string, i: number) => (
              <span key={i} className="px-3 py-1 rounded-full bg-white border border-[#003020]/10 text-xs font-medium text-neutral-700 shadow-2xs">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Shop The Collection CTA Card */}
        <div className="mt-14 bg-gradient-to-r from-[#003020] to-[#0A4532] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[#F3D98F] text-xs font-bold uppercase tracking-widest flex items-center justify-center md:justify-start gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#F3D98F]" /> Sacred Seva Offerings
            </span>
            <h3 className="font-serif text-2xl font-bold">Adorn Your Thakur Ji Today</h3>
            <p className="text-white/80 text-sm max-w-md">
              Explore our handcrafted collection of pure silk poshak, mor pankh mukuts, and complete shringaar sets.
            </p>
          </div>
          <Button asChild size="lg" className="bg-[#E6C16A] hover:bg-[#D4AF4A] text-[#003020] font-bold rounded-full px-8 shrink-0 shadow-md">
            <Link href="/search?category=Poshak">
              Explore Collection <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#003020]/10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-[#003020]">Related Devotional Guides</h3>
              <Link href="/blogs" className="text-xs font-bold text-[#003020] hover:text-[#C88A20] flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel: any) => (
                <Link
                  key={rel.id}
                  href={`/blogs/${rel.slug}`}
                  className="bg-white rounded-2xl p-4 border border-[#003020]/10 shadow-2xs hover:shadow-md transition-shadow group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[#C88A20] uppercase">{rel.category}</span>
                    <h4 className="font-serif font-bold text-sm text-[#003020] group-hover:text-[#C88A20] transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-neutral-400 pt-3 inline-flex items-center gap-1 font-medium">
                    Read Guide <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </article>
  );
}
