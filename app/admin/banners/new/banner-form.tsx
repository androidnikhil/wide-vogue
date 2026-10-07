'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { createBanner } from '@/lib/actions/banner.actions';
import { Loader2 } from 'lucide-react';

export default function BannerForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.url);
        toast.success('Image optimized and uploaded successfully as WebP');
      } else {
        toast.error(data.message || 'Failed to upload image');
      }
    } catch (err) {
      toast.error('An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const linkUrl = formData.get('linkUrl') as string;
    const position = Number(formData.get('position') || 0);

    if (!title || !imageUrl) {
      toast.error('Title and Image are required');
      return;
    }

    startTransition(async () => {
      const res = await createBanner({ title, subtitle, imageUrl, linkUrl, position, isActive: true });
      if (res.success) {
        toast.success('Banner created successfully');
        router.push('/admin/banners');
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <Card className="bg-surface-container-lowest border-outline-variant/30">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Banner Title</Label>
            <Input name="title" required placeholder="e.g., Diwali Special Sale" />
          </div>
          <div className="space-y-2">
            <Label>Subtitle (Optional)</Label>
            <Input name="subtitle" placeholder="e.g., Up to 50% Off on Poshak" />
          </div>
          <div className="space-y-2">
            <Label>Link URL (Optional)</Label>
            <Input name="linkUrl" placeholder="e.g., /search?category=Poshak" />
          </div>
          <div className="space-y-2">
            <Label>Display Position</Label>
            <Input type="number" name="position" defaultValue={0} min={0} />
          </div>
          
          <div className="space-y-2 pt-4 border-t border-outline-variant/30">
            <Label>Upload Banner Image (Will be converted to WebP)</Label>
            <Input type="file" accept="image/*" onChange={handleUpload} disabled={isUploading} />
            {isUploading && <p className="text-sm text-secondary flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Optimizing image...</p>}
            
            {imageUrl && (
              <div className="mt-4">
                <p className="text-sm text-on-surface-variant mb-2">Preview:</p>
                <img src={imageUrl} alt="Preview" className="w-full max-h-[200px] object-cover rounded-lg shadow-sm" />
                <input type="hidden" name="imageUrl" value={imageUrl} />
              </div>
            )}
          </div>

          <div className="pt-6">
            <Button type="submit" disabled={isPending || isUploading || !imageUrl} className="w-full">
              {isPending ? 'Saving...' : 'Save Banner'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
