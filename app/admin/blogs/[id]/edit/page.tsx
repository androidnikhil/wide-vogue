import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/db/prisma';
import BlogForm from '../../blog-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Edit Blog Article | Admin Portal',
};

interface EditBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;

  const post = await (prisma as any).blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Blog Article</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Update the content, cover image, or SEO settings for &ldquo;{post.title}&rdquo;.
        </p>
      </div>

      <BlogForm initialData={post} isEditMode={true} />
    </div>
  );
}
