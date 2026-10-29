import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { UTApi } from 'uploadthing/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}.webp`;

    // Process image in memory using Sharp: resize if too large, convert to WebP at 90% quality
    const webpBuffer = await sharp(buffer)
      .resize({ width: 1920, withoutEnlargement: true }) // Max width 1920px
      .webp({ quality: 90 })
      .toBuffer();

    // 1. Primary: Upload to UploadThing Cloud CDN (Works reliably on Vercel Serverless & Production)
    try {
      const utapi = new UTApi();
      const webpFile = new File([webpBuffer], filename, { type: 'image/webp' });
      const uploadRes = await utapi.uploadFiles(webpFile);

      if (uploadRes?.data?.url) {
        return NextResponse.json({ success: true, url: uploadRes.data.url });
      }
      if (uploadRes?.error) {
        console.warn('UploadThing upload returned error, trying local fallback:', uploadRes.error);
      }
    } catch (utErr) {
      console.warn('UploadThing upload failed, falling back to local disk:', utErr);
    }

    // 2. Fallback: Save to local disk (useful in local dev / non-serverless environments)
    try {
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const filepath = join(uploadDir, filename);
      await writeFile(filepath, webpBuffer);
      return NextResponse.json({ success: true, url: `/uploads/${filename}` });
    } catch (fsErr) {
      console.error('Local disk write failed:', fsErr);
    }

    return NextResponse.json({ success: false, message: 'File upload failed' }, { status: 500 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, message: 'File upload failed' }, { status: 500 });
  }
}

