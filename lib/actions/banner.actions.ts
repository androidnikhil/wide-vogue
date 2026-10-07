'use server';

import { prisma } from '@/db/prisma';
import { auth } from '@/auth';

export async function createBanner(data: {
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  position?: number;
  isActive?: boolean;
}) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl,
        position: data.position ?? 0,
        isActive: data.isActive ?? true,
      },
    });

    return { success: true, message: 'Banner created successfully', banner };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to create banner' };
  }
}
