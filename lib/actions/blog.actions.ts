'use server';

import { prisma } from '@/db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export interface BlogPostData {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  authorName?: string;
  isPublished?: boolean;
  readingTime?: number;
  metaTitle?: string;
  metaDescription?: string;
}

// Generate URL slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Calculate approximate reading time (200 words per minute)
function calculateReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// ==============================================================================
// 1. GET ALL BLOG POSTS (Public & Admin)
// ==============================================================================
export async function getAllBlogPosts(options?: {
  isPublishedOnly?: boolean;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const { isPublishedOnly = false, category, search, page = 1, limit = 12 } = options || {};

    const where: any = {};

    if (isPublishedOnly) {
      where.isPublished = true;
    }

    if (category && category !== 'All') {
      where.category = {
        equals: category,
        mode: 'insensitive',
      };
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [posts, totalCount] = await Promise.all([
      (prisma as any).blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      (prisma as any).blogPost.count({ where }),
    ]);

    return {
      success: true,
      posts,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    return { success: false, posts: [], totalCount: 0, totalPages: 0, message: error.message };
  }
}

// ==============================================================================
// 2. GET SINGLE BLOG POST BY SLUG
// ==============================================================================
export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await (prisma as any).blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      return { success: false, message: 'Article not found' };
    }

    // Fetch related articles from same category
    const relatedPosts = await (prisma as any).blogPost.findMany({
      where: {
        category: post.category,
        isPublished: true,
        NOT: { id: post.id },
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
    });

    return { success: true, post, relatedPosts };
  } catch (error: any) {
    console.error('Error fetching blog post:', error);
    return { success: false, message: error.message };
  }
}

// ==============================================================================
// 3. CREATE BLOG POST (Admin Only)
// ==============================================================================
export async function createBlogPost(data: BlogPostData) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
      return { success: false, message: 'Unauthorized. Admin access required.' };
    }

    if (!data.title || !data.content) {
      return { success: false, message: 'Title and content are required.' };
    }

    let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title);
    if (!slug) {
      slug = `post-${Date.now()}`;
    }

    // Ensure unique slug
    const existing = await (prisma as any).blogPost.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const readingTime = data.readingTime || calculateReadingTime(data.content);

    const post = await (prisma as any).blogPost.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || data.content.slice(0, 160).replace(/<[^>]*>?/gm, ''),
        content: data.content,
        featuredImage: data.featuredImage || '/images/devotional/hero_krishna.webp',
        category: data.category || 'Devotional Seva',
        tags: data.tags || [],
        authorName: data.authorName || 'Madhav Shringaar Seva Team',
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
        readingTime,
        metaTitle: data.metaTitle || `${data.title} | Madhav Shringaar`,
        metaDescription: data.metaDescription || data.excerpt,
        publishedAt: new Date(),
      },
    });

    revalidatePath('/blogs');
    revalidatePath('/admin/blogs');

    return { success: true, message: 'Blog post published successfully!', post };
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return { success: false, message: error.message || 'Failed to create blog post' };
  }
}

// ==============================================================================
// 4. UPDATE BLOG POST (Admin Only)
// ==============================================================================
export async function updateBlogPost(id: string, data: Partial<BlogPostData>) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
      return { success: false, message: 'Unauthorized. Admin access required.' };
    }

    const updateData: any = { ...data };

    if (data.title && !data.slug) {
      // keep existing slug unless explicitly edited
    } else if (data.slug) {
      updateData.slug = generateSlug(data.slug);
    }

    if (data.content && !data.readingTime) {
      updateData.readingTime = calculateReadingTime(data.content);
    }

    const post = await (prisma as any).blogPost.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/blogs');
    revalidatePath(`/blogs/${post.slug}`);
    revalidatePath('/admin/blogs');

    return { success: true, message: 'Blog post updated successfully!', post };
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    return { success: false, message: error.message || 'Failed to update blog post' };
  }
}

// ==============================================================================
// 5. DELETE BLOG POST (Admin Only)
// ==============================================================================
export async function deleteBlogPost(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
      return { success: false, message: 'Unauthorized. Admin access required.' };
    }

    await (prisma as any).blogPost.delete({
      where: { id },
    });

    revalidatePath('/blogs');
    revalidatePath('/admin/blogs');

    return { success: true, message: 'Blog post deleted successfully!' };
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return { success: false, message: error.message || 'Failed to delete blog post' };
  }
}

// ==============================================================================
// 6. TOGGLE PUBLISH STATUS (Admin Only)
// ==============================================================================
export async function togglePublishStatus(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
      return { success: false, message: 'Unauthorized. Admin access required.' };
    }

    const existing = await (prisma as any).blogPost.findUnique({
      where: { id },
      select: { isPublished: true, slug: true },
    });

    if (!existing) {
      return { success: false, message: 'Article not found.' };
    }

    const updated = await (prisma as any).blogPost.update({
      where: { id },
      data: { isPublished: !existing.isPublished },
    });

    revalidatePath('/blogs');
    revalidatePath(`/blogs/${existing.slug}`);
    revalidatePath('/admin/blogs');

    return {
      success: true,
      message: updated.isPublished ? 'Article published live!' : 'Article reverted to draft.',
      isPublished: updated.isPublished,
    };
  } catch (error: any) {
    console.error('Error toggling publish status:', error);
    return { success: false, message: error.message || 'Failed to toggle status' };
  }
}
