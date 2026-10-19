import { Metadata } from 'next';
import BlogForm from '../blog-form';

export const metadata: Metadata = {
  title: 'Write New Blog Post | Admin Portal',
};

export default function CreateBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Create New Blog Article</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Publish a devotional guide, festival insight, or deity care tips for your community.
        </p>
      </div>

      <BlogForm />
    </div>
  );
}
