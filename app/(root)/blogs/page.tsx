import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllBlogPosts } from '@/lib/actions/blog.actions';
import { formatDateTime } from '@/lib/utils';
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles, Feather } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Devotional Seva Journal & Bhakti Blogs | Madhav Shringaar',
  description:
    'Explore devotional guides on Shri Laddu Gopal Ji seva, festival traditions, poshak size selection, and sacred Vrindavan craftsmanship from Madhav Shringaar.',
  keywords: [
    'Laddu Gopal seva guide',
    'Kanha Ji daily seva',
    'Laddu Gopal poshak care',
    'Vrindavan festival traditions',
    'Janmashtami poshak guide',
    'Madhav Shringaar blog',
  ],
  alternates: {
    canonical: '/blogs',
  },
};

interface BlogsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || 'All';
  const currentSearch = resolvedParams.search || '';
  const currentPage = Number(resolvedParams.page || 1);

  const result = await getAllBlogPosts({
    isPublishedOnly: true,
    category: currentCategory,
    search: currentSearch,
    page: currentPage,
    limit: 12,
  });

  const posts = result.posts || [];
  const categories = [
    'All',
    'Devotional Seva',
    'Festivals & Vrats',
    'Poshak & Shringaar',
    'Vrindavan Katha',
    'Daily Temple Tips',
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#003020]">
      {/* 1. HERO HEADER */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#FAF4E6] to-[#FDFBF7] border-b border-[#E6C16A]/20">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6C16A]/20 border border-[#E6C16A]/50 text-[#8A5A0A] text-xs font-semibold uppercase tracking-widest shadow-2xs">
            <Feather className="w-4 h-4 text-[#C88A20]" />
            Bhakti &amp; Seva Journal
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#003020] tracking-tight">
            Sacred Stories, Seva Guides &amp; <span className="italic text-[#C88A20]">Devotional Heritage</span>
          </h1>

          <p className="text-neutral-600 text-sm md:text-base max-w-2xl mx-auto font-serif leading-relaxed">
            Immerse yourself in authentic rituals, festive dressing guides, and timeless teachings on adorning Shri Laddu Gopal Ji with pure love.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 pt-6">
            {categories.map((cat) => {
              const isActive = currentCategory.toLowerCase() === cat.toLowerCase();
              return (
                <Link
                  key={cat}
                  href={cat === 'All' ? '/blogs' : `/blogs?category=${encodeURIComponent(cat)}`}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-2xs ${
                    isActive
                      ? 'bg-[#003020] text-[#F3D98F] shadow-sm'
                      : 'bg-white text-neutral-700 hover:text-[#003020] hover:bg-[#FAF4E6] border border-[#003020]/10'
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. ARTICLES GRID */}
      <section className="py-16 max-w-7xl mx-auto px-6 md:px-12">
        {posts.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-[#003020]/10 max-w-xl mx-auto space-y-4 shadow-sm">
            <BookOpen className="w-12 h-12 text-[#C88A20] mx-auto opacity-70" />
            <h3 className="font-serif font-bold text-xl text-[#003020]">Devotional Articles Coming Soon</h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-sans">
              We are currently preparing insightful guides on deity seva, fabric care, and Braj traditions. Please check back soon or explore our collections!
            </p>
            <div className="pt-2">
              <Link
                href="/search?category=Poshak"
                className="inline-block bg-[#003020] text-[#F3D98F] px-6 py-2.5 rounded-full text-xs font-bold shadow-sm hover:bg-[#002518]"
              >
                Browse Poshak Collection
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#003020]/10 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group hover:-translate-y-1"
              >
                {/* Cover Image */}
                <Link href={`/blogs/${post.slug}`} className="relative w-full h-52 sm:h-56 aspect-[16/10] overflow-hidden block">
                  <Image
                    src={post.featuredImage || '/images/devotional/complete_shringar.webp'}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-[#003020] shadow-xs border border-[#E6C16A]/40">
                    {post.category}
                  </div>
                </Link>

                {/* Article Info */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-neutral-500 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#C88A20]" />
                        {formatDateTime(new Date(post.publishedAt || post.createdAt)).dateOnly}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#0F6F74]" />
                        {post.readingTime || 3} min read
                      </span>
                    </div>

                    <h2 className="font-serif font-bold text-lg md:text-xl text-[#003020] group-hover:text-[#C88A20] transition-colors leading-snug line-clamp-2">
                      <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-neutral-600 text-xs md:text-sm leading-relaxed line-clamp-3 font-sans">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-500 font-medium">By {post.authorName}</span>
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="text-xs font-bold text-[#003020] group-hover:text-[#C88A20] inline-flex items-center gap-1 transition-colors"
                    >
                      Read Guide <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
