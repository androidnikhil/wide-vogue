'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Sparkles,
  Search,
  UploadCloud,
  Loader2,
  RefreshCw,
  Eye,
  Edit3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote as QuoteIcon,
  Minus,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { createBlogPost, updateBlogPost, BlogPostData } from '@/lib/actions/blog.actions';
import BlogContentRenderer from '@/components/blog/blog-content-renderer';
import { convertFilesToWebP } from '@/lib/utils/image-converter';
import { UploadButton } from '@/lib/uploadthing';

interface BlogFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

export default function BlogForm({ initialData, isEditMode = false }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isSlugCustom, setIsSlugCustom] = useState(Boolean(initialData?.slug && isEditMode));
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [featuredImage, setFeaturedImage] = useState(
    initialData?.featuredImage || '/images/devotional/complete_shringar.webp'
  );
  const [category, setCategory] = useState(initialData?.category || 'Devotional Seva');
  const [authorName, setAuthorName] = useState(initialData?.authorName || 'Madhav Shringaar Seva Team');
  const [tagsInput, setTagsInput] = useState(
    Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : ''
  );
  const [isPublished, setIsPublished] = useState(
    initialData?.isPublished !== undefined ? initialData.isPublished : true
  );
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '');

  const categories = [
    'Devotional Seva',
    'Festivals & Vrats',
    'Poshak & Shringaar',
    'Vrindavan Katha',
    'Daily Temple Tips',
  ];

  // Helper to slugify text
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Auto-generate slug when title changes (unless manually customized)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustom) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugCustom(true);
    setSlug(val);
  };

  const regenerateSlugFromTitle = () => {
    if (!title.trim()) {
      toast.error('Please enter an Article Title first.');
      return;
    }
    const newSlug = generateSlug(title);
    setSlug(newSlug);
    setIsSlugCustom(false);
    toast.success('Slug regenerated from title!');
  };

  // Handle Cover Image Upload with client WebP conversion & cloud upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error('Image size must be under 15MB.');
      return;
    }

    setIsUploadingImage(true);
    const toastId = toast.loading('Converting image to WebP & uploading...');

    try {
      // 1. Client-side WebP compression for superfast upload
      const [webpFile] = await convertFilesToWebP([file]);
      const fileToUpload = webpFile || file;

      const formData = new FormData();
      formData.append('file', fileToUpload);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setFeaturedImage(data.url);
        toast.success('Cover image converted to WebP and saved!', { id: toastId });
      } else {
        toast.error(data.message || 'Failed to upload image.', { id: toastId });
      }
    } catch (err) {
      console.error('Image upload error:', err);
      toast.error('An error occurred during image upload.', { id: toastId });
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  // Helper to insert markdown or text at cursor
  const insertHelperText = (prefix: string, suffix: string = '') => {
    setContent((prev: string) => `${prev}\n${prefix}Your text here${suffix}\n`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both Title and Article Content.');
      return;
    }

    setLoading(true);
    const tags = tagsInput
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    const postData: BlogPostData = {
      title,
      slug: slug.trim() || generateSlug(title),
      excerpt,
      content,
      featuredImage: featuredImage.trim() || '/images/devotional/complete_shringar.webp',
      category,
      tags,
      authorName,
      isPublished,
      metaTitle: metaTitle || `${title} | Madhav Shringaar`,
      metaDescription: metaDescription || excerpt,
    };

    try {
      if (isEditMode && initialData?.id) {
        const res = await updateBlogPost(initialData.id, postData);
        if (res.success) {
          toast.success(res.message);
          router.push('/admin/blogs');
          router.refresh();
        } else {
          toast.error(res.message);
        }
      } else {
        const res = await createBlogPost(postData);
        if (res.success) {
          toast.success(res.message);
          router.push('/admin/blogs');
          router.refresh();
        } else {
          toast.error(res.message);
        }
      }
    } catch {
      toast.error('An error occurred while saving the post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl border-neutral-300 text-xs font-semibold gap-1.5"
        >
          <Link href="/admin/blogs">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Blogs
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-2 border-r border-neutral-200">
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer focus:outline-hidden ${
                isPublished ? 'bg-emerald-600' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublished ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span
              className="text-xs font-semibold cursor-pointer select-none text-neutral-800"
              onClick={() => setIsPublished(!isPublished)}
            >
              {isPublished ? 'Publish Live' : 'Draft Only'}
            </span>
          </div>

          <Button
            type="submit"
            disabled={loading || isUploadingImage}
            className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] rounded-xl font-bold text-xs gap-1.5 px-5 shadow-sm"
          >
            <Save className="w-4 h-4 text-[#F3D98F]" />
            {loading ? 'Saving...' : isEditMode ? 'Update Article' : 'Publish Article'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Title & Slug */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                Article Title *
              </Label>
              <Input
                placeholder="e.g. Complete Seva Guide for Shri Laddu Gopal Ji: Daily Morning to Shayan"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="font-serif text-lg md:text-xl rounded-xl border-neutral-300"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                  URL Slug *
                </Label>
                <button
                  type="button"
                  onClick={regenerateSlugFromTitle}
                  className="text-[11px] text-[#0F6F74] hover:text-[#003020] font-semibold flex items-center gap-1 underline underline-offset-2 cursor-pointer"
                  title="Auto-generate slug from title"
                >
                  <RefreshCw className="w-3 h-3 text-[#C88A20]" /> Auto-generate from Title
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-mono">/blogs/</span>
                <Input
                  placeholder="article-url-slug"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="rounded-xl border-neutral-300 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                Short Excerpt / Summary *
              </Label>
              <Textarea
                placeholder="A brief 2-3 line summary displayed on cards and search results..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="rounded-xl border-neutral-300 text-xs leading-relaxed"
              />
            </div>
          </div>

          {/* Article Body Content with Write / Live Preview Tabs */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Article Body Content *
                </Label>
                {/* Tab Switcher */}
                <div className="inline-flex rounded-xl bg-neutral-100 p-0.5 border border-neutral-200/80">
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === 'write'
                        ? 'bg-white text-[#003020] shadow-2xs font-bold'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === 'preview'
                        ? 'bg-[#003020] text-[#F3D98F] shadow-2xs font-bold'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" /> Live Preview
                  </button>
                </div>
              </div>

              {/* Formatting Toolbar */}
              {activeTab === 'write' && (
                <div className="flex items-center gap-1 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertHelperText('## ')}
                    className="h-7 px-2 text-[11px] rounded-lg font-bold"
                    title="Section Heading (H2)"
                  >
                    H2
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertHelperText('### ')}
                    className="h-7 px-2 text-[11px] rounded-lg font-bold"
                    title="Subheading (H3)"
                  >
                    H3
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertHelperText('**', '**')}
                    className="h-7 px-2 text-[11px] rounded-lg"
                    title="Bold (**text**)"
                  >
                    <Bold className="w-3 h-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertHelperText('*', '*')}
                    className="h-7 px-2 text-[11px] rounded-lg"
                    title="Italic (*text*)"
                  >
                    <Italic className="w-3 h-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertHelperText('> ')}
                    className="h-7 px-2 text-[11px] rounded-lg"
                    title="Devotional Quote (> text)"
                  >
                    <QuoteIcon className="w-3 h-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertHelperText('• ')}
                    className="h-7 px-2 text-[11px] rounded-lg"
                    title="Bullet Point (• text)"
                  >
                    <List className="w-3 h-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertHelperText('1. ')}
                    className="h-7 px-2 text-[11px] rounded-lg"
                    title="Numbered Point (1. text)"
                  >
                    <ListOrdered className="w-3 h-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertHelperText('---')}
                    className="h-7 px-2 text-[11px] rounded-lg"
                    title="Divider (---)"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>

            {activeTab === 'write' ? (
              <div className="space-y-2">
                <Textarea
                  placeholder="Write or paste your article here. Supports rich pasted text, HTML, headings (##, ###), bullet points (•, -), numbered lists (1.), quotes (>), and bold text (**bold**)..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={18}
                  required
                  className="rounded-xl border-neutral-300 text-sm leading-relaxed font-sans"
                />
                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                  <span>Supports pasted formatted text, HTML, and Markdown.</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className="text-[#0F6F74] hover:underline font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> View formatted preview
                  </button>
                </div>
              </div>
            ) : (
              /* Live Preview Mode */
              <div className="rounded-2xl border border-neutral-200/90 bg-[#FAF8F5] p-6 sm:p-8 min-h-[350px]">
                <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs">
                  {content.trim() ? (
                    <BlogContentRenderer content={content} />
                  ) : (
                    <div className="text-center py-12 text-neutral-400 text-xs">
                      No content written yet. Switch to &ldquo;Write&rdquo; to add text.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SEO Metadata Settings */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#003020] font-bold text-sm">
              <Search className="w-4 h-4 text-[#C88A20]" />
              <span>Google Search (SEO) Settings</span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700">Meta Title</Label>
              <Input
                placeholder="Google search title (Defaults to Article Title)"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="rounded-xl border-neutral-300 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700">Meta Description</Label>
              <Textarea
                placeholder="150-160 characters summary for Google search snippet"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={2}
                className="rounded-xl border-neutral-300 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings (Right 1 Column) */}
        <div className="space-y-6">
          {/* Featured Image with File Upload Button & WebP Converter */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Featured Cover Image
              </Label>
              {featuredImage?.endsWith('.webp') && (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> WebP
                </span>
              )}
            </div>

            {/* Image Preview Box */}
            <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
              {featuredImage ? (
                <Image
                  src={featuredImage}
                  alt="Cover Preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                  No Image Selected
                </div>
              )}
            </div>

            {/* Choose File Upload Button (Converts to WebP) */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-neutral-700 block">
                Upload New Image (Converts to WebP)
              </Label>
              <label
                className={`flex items-center justify-center gap-2 w-full p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer text-xs font-bold ${
                  isUploadingImage
                    ? 'border-neutral-300 bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    : 'border-[#003020]/25 hover:border-[#003020] bg-neutral-50 hover:bg-[#FAF4E6]/60 text-[#003020]'
                }`}
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#003020]" />
                    <span>Converting to WebP & Saving...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 text-[#C88A20]" />
                    <span>Choose Image (JPG, PNG, WebP)</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg,image/avif"
                  disabled={isUploadingImage}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* Direct UploadThing Cloud CDN Option */}
              <div className="pt-0.5">
                <UploadButton
                  endpoint="imageUploader"
                  appearance={{
                    button: "w-full bg-[#003020] text-[#F3D98F] text-xs font-bold rounded-xl py-2 px-3 hover:bg-[#003020]/90 transition-all shadow-2xs cursor-pointer ut-uploading:opacity-75",
                    allowedContent: "text-neutral-400 text-[10px] mt-1 font-medium",
                    container: "w-full border border-neutral-200/80 rounded-xl p-2 bg-neutral-50/50 flex flex-col items-center justify-center",
                  }}
                  content={{
                    button({ ready, isUploading }) {
                      if (isUploading) return 'Uploading to Cloud...';
                      if (ready) return 'Cloud CDN Direct Upload';
                      return 'Connecting to CDN...';
                    },
                    allowedContent({ ready, isUploading }) {
                      if (isUploading) return 'Compressing & uploading...';
                      if (ready) return 'Direct Cloud Storage (UploadThing)';
                      return '';
                    },
                  }}
                  onBeforeUploadBegin={async (files) => {
                    toast.loading('Converting to WebP...', { id: 'blog-cloud-webp' });
                    try {
                      const webpFiles = await convertFilesToWebP(files);
                      toast.dismiss('blog-cloud-webp');
                      return webpFiles;
                    } catch (e) {
                      toast.dismiss('blog-cloud-webp');
                      return files;
                    }
                  }}
                  onClientUploadComplete={(res: { url: string }[]) => {
                    if (res && res[0]?.url) {
                      setFeaturedImage(res[0].url);
                      toast.success('Cover image uploaded successfully to cloud!');
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Cloud upload error: ${error.message}`);
                  }}
                />
              </div>
            </div>

            {/* Direct Image URL input */}
            <div className="space-y-1.5 pt-1">
              <Label className="text-xs text-neutral-500 font-medium">Or Paste Image URL / Path</Label>
              <Input
                placeholder="/images/devotional/complete_shringar.webp"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="rounded-xl border-neutral-300 text-xs font-mono"
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-1 pt-1">
              <p className="text-[10px] text-neutral-400 font-semibold uppercase">Quick Presets:</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Krishna Darshan', url: '/images/devotional/hero_krishna.webp' },
                  { label: 'Poshak Art', url: '/images/devotional/poshak.webp' },
                  { label: 'Mukut Pagdi', url: '/images/devotional/mukut.webp' },
                  { label: 'Complete Set', url: '/images/devotional/complete_shringar.webp' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFeaturedImage(preset.url)}
                    className="text-[10px] p-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-left truncate"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category & Author */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                Category *
              </Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-xs font-medium focus:ring-2 focus:ring-[#003020]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                Author Name
              </Label>
              <Input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Madhav Shringaar Seva Team"
                className="rounded-xl border-neutral-300 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                Tags (Comma Separated)
              </Label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Laddu Gopal, Poshak Care, Braj Dham"
                className="rounded-xl border-neutral-300 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
