'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { deleteBlogPost, togglePublishStatus } from '@/lib/actions/blog.actions';
import { formatDateTime } from '@/lib/utils';

interface BlogListProps {
  initialPosts: any[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const categories = ['All', 'Devotional Seva', 'Festivals & Vrats', 'Poshak & Shringaar', 'Vrindavan Katha'];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'All' || post.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setIsDeleting(id);
    try {
      const res = await deleteBlogPost(id);
      if (res.success) {
        toast.success(res.message);
        setPosts((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to delete blog post');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleTogglePublish = async (id: string) => {
    setIsToggling(id);
    try {
      const res = await togglePublishStatus(id);
      if (res.success) {
        toast.success(res.message);
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isPublished: res.isPublished } : p))
        );
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setIsToggling(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rounded-xl border-neutral-300 h-10 text-xs"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#003020] text-[#F3D98F] shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-neutral-300 mx-auto" />
            <p className="text-sm font-semibold text-neutral-700">No blog posts found</p>
            <p className="text-xs text-neutral-400">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Create your first devotional blog post to get started!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-600 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/80">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-neutral-50/50 transition-colors">
                    {/* Article Thumbnail & Title */}
                    <td className="py-3 px-4 max-w-md">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0 relative border border-neutral-200">
                          {post.featuredImage ? (
                            <Image
                              src={post.featuredImage}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                              <BookOpen className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-0.5 truncate">
                          <Link
                            href={`/blogs/${post.slug}`}
                            target="_blank"
                            className="font-bold text-neutral-900 hover:text-[#003020] hover:underline truncate block"
                          >
                            {post.title}
                          </Link>
                          <p className="text-[11px] text-neutral-500 line-clamp-1">{post.excerpt}</p>
                          <span className="text-[10px] text-neutral-400 font-mono">/blogs/{post.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-[10px] rounded-md font-medium">
                        {post.category}
                      </Badge>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(post.id)}
                        disabled={isToggling === post.id}
                        className="cursor-pointer"
                        title="Click to toggle publish status"
                      >
                        {post.isPublished ? (
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-[10px] gap-1 rounded-md border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            Published
                          </Badge>
                        ) : (
                          <Badge className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-[10px] gap-1 rounded-md border-neutral-300">
                            <Clock className="w-3 h-3 text-neutral-500" />
                            Draft
                          </Badge>
                        )}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-neutral-500 text-[11px] whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        {formatDateTime(new Date(post.publishedAt || post.createdAt)).dateOnly}
                      </div>
                      <span className="text-[10px] text-neutral-400">{post.readingTime || 3} min read</span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                          title="View live post"
                        >
                          <Link href={`/blogs/${post.slug}`} target="_blank">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>

                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                          title="Edit post"
                        >
                          <Link href={`/admin/blogs/${post.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isDeleting === post.id}
                          onClick={() => handleDelete(post.id, post.title)}
                          className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                          title="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
