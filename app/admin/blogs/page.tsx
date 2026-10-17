import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';
import { getAllBlogPosts } from '@/lib/actions/blog.actions';
import BlogList from './blog-list';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog Management | Admin Portal',
};

export default async function AdminBlogsPage() {
  const result = await getAllBlogPosts({ limit: 100 });
  const posts = result.posts || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#003020]" />
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Blog Management</h1>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Publish devotional seva articles, festival guides, and poshak styling tips for your devotees.
          </p>
        </div>

        <Button asChild className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] rounded-xl font-bold shadow-sm">
          <Link href="/admin/blogs/create">
            <Plus className="w-4 h-4 mr-2 text-[#F3D98F]" />
            Write New Blog Post
          </Link>
        </Button>
      </div>

      <BlogList initialPosts={posts} />
    </div>
  );
}
