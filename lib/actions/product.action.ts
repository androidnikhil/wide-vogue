'use server'
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCT_LIMIT, PAGE_SIZE } from "../constants";
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { insertProductSchema, updateProductSchema } from '../validators';
import { z } from 'zod';
import { Product } from '@/types';

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCT_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  return convertToPlainObject(data) as Product[];
}
// Get  single product by it's slug

export async function getProductBySlug(slug: string) {
    const data = await prisma.product.findFirst({
        where: {
            slug
        }
    });
    return convertToPlainObject(data) as Product;
}

// Get single product by it's ID
export async function getProductById(productId: string) {
    const data = await prisma.product.findFirst({
      where: { id: productId },
    });
  
    return convertToPlainObject(data) as Product;
  }
  
  // Get all products
  export async function getAllProducts({
    query,
    limit = PAGE_SIZE,
    page,
    category,
    price,
    rating,
    sort,
    size,
  }: {
    query: string;
    limit?: number;
    page: number;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    size?: string;
  }) {
    // Split query into words to allow partial matches (e.g., "laddu gopal" matching "Laadu Gopal" because "Gopal" matches)
    const queryWords = query && query !== 'all' ? query.split(' ').filter(w => w.length > 1) : [];

    // Query filter
    const queryFilter: Prisma.ProductWhereInput =
      queryWords.length > 0
        ? {
            OR: queryWords.flatMap((word) => [
              { name: { contains: word, mode: 'insensitive' } as Prisma.StringFilter },
              { category: { contains: word, mode: 'insensitive' } as Prisma.StringFilter },
            ]),
          }
        : {};
  
    // Category filter
    const categoryFilter = category && category !== 'all' ? { category } : {};
  
    // Price filter
    const priceFilter: Prisma.ProductWhereInput =
      price && price !== 'all'
        ? {
            price: {
              gte: Number(price.split('-')[0]),
              lte: Number(price.split('-')[1]),
            },
          }
        : {};
  
    // Rating filter
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              gte: Number(rating),
            },
          }
        : {};
        
    // Size filter
    const sizeFilter = size && size !== 'all' ? { sizes: { has: size } } : {};
  
    const data = await prisma.product.findMany({
      where: {
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
        ...sizeFilter,
      },
      orderBy:
        sort === 'lowest'
          ? { price: 'asc' }
          : sort === 'highest'
          ? { price: 'desc' }
          : sort === 'rating'
          ? { rating: 'desc' }
          : { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  
    const dataCount = await prisma.product.count({
      where: {
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
        ...sizeFilter,
      }
    });
  
    return {
      data: data as any as Product[],
      totalPages: Math.ceil(dataCount / limit),
    };
  }

  // Delete a product
export async function deleteProduct(id: string) {
    try {
      const session = await auth();
      if (session?.user?.role !== 'admin') throw new Error('Unauthorized: Admin access required');
      const productExists = await prisma.product.findFirst({
        where: { id },
      });
  
      if (!productExists) throw new Error('Product not found');
  
      await prisma.product.delete({ where: { id } });
  
      revalidatePath('/admin/products');
  
      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      return { success: false, message: formatError(error) };
    }
  }
  
// Create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
    try {
      const session = await auth();
      if (session?.user?.role !== 'admin') throw new Error('Unauthorized: Admin access required');
      const product = insertProductSchema.parse(data);
      await prisma.product.create({ data: product });
  
      revalidatePath('/admin/products');
  
      return {
        success: true,
        message: 'Product created successfully',
      };
    } catch (error) {
      return { success: false, message: formatError(error) };
    }
  }
  
  // Update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
    try {
      const session = await auth();
      if (session?.user?.role !== 'admin') throw new Error('Unauthorized: Admin access required');
      const product = updateProductSchema.parse(data);
      const productExists = await prisma.product.findFirst({
        where: { id: product.id },
      });
  
      if (!productExists) throw new Error('Product not found');
  
      await prisma.product.update({
        where: { id: product.id },
        data: product,
      });
  
      revalidatePath('/admin/products');
  
      return {
        success: true,
        message: 'Product updated successfully',
      };
    } catch (error) {
      return { success: false, message: formatError(error) };
    }
  }

  // Get all categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  });

  return data;
}

// Get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  return convertToPlainObject(data);
}