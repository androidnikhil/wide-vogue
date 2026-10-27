'use server'
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCT_LIMIT, PAGE_SIZE } from "../constants";
import { Prisma } from '@prisma/client';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { insertProductSchema, updateProductSchema } from '../validators';
import { z } from 'zod';
import { Product } from '@/types';

// Get latest products (Cached in Server RAM with tag revalidation)
export async function getLatestProducts() {
  const getCached = unstable_cache(
    async () => {
      const data = await prisma.product.findMany({
        take: Math.max(LATEST_PRODUCT_LIMIT || 4, 8),
        orderBy: { createdAt: 'desc' },
      });
      return convertToPlainObject(data) as unknown as Product[];
    },
    ['latest-products'],
    { revalidate: 3600, tags: ['products', 'latest-products'] }
  );

  return getCached();
}

// Get single product by its slug (Cached in Server RAM with tag revalidation)
export async function getProductBySlug(slug: string) {
  const getCached = unstable_cache(
    async () => {
      const data = await prisma.product.findFirst({
        where: { slug },
      });
      return convertToPlainObject(data) as unknown as Product;
    },
    ['product-by-slug', slug],
    { revalidate: 3600, tags: ['products', `product-${slug}`] }
  );

  return getCached();
}

// Get single product by it's ID
export async function getProductById(productId: string) {
    const data = await prisma.product.findFirst({
      where: { id: productId },
    });
  
    return convertToPlainObject(data) as unknown as Product;
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
  
    // Category filter with parent-category / family matching
    let categoryFilter: Prisma.ProductWhereInput = {};
    if (category && category !== 'all') {
      const catLower = category.toLowerCase().trim();
      if (catLower === 'poshak') {
        categoryFilter = {
          OR: [
            { category: { equals: 'Poshak', mode: 'insensitive' } },
            { category: { contains: 'Poshak', mode: 'insensitive' } },
          ],
        };
      } else if (catLower === 'mukut & bansuri' || catLower === 'mukut & pagdi') {
        categoryFilter = {
          OR: [
            { category: { contains: 'Mukut', mode: 'insensitive' } },
            { category: { contains: 'Pagdi', mode: 'insensitive' } },
            { category: { contains: 'Bansuri', mode: 'insensitive' } },
          ],
        };
      } else if (catLower === 'jewellery & mala') {
        categoryFilter = {
          OR: [
            { category: { contains: 'Jewellery', mode: 'insensitive' } },
            { category: { contains: 'Mala', mode: 'insensitive' } },
            { category: { contains: 'Haar', mode: 'insensitive' } },
          ],
        };
      } else if (catLower === 'festive sets') {
        categoryFilter = {
          OR: [
            { category: { contains: 'Festive', mode: 'insensitive' } },
            { category: { contains: 'Combo', mode: 'insensitive' } },
            { category: { contains: 'Shringar', mode: 'insensitive' } },
          ],
        };
      } else if (catLower === 'seva essentials') {
        categoryFilter = {
          OR: [
            { category: { contains: 'Seva', mode: 'insensitive' } },
            { category: { contains: 'Essentials', mode: 'insensitive' } },
            { category: { contains: 'Attar', mode: 'insensitive' } },
            { category: { contains: 'Itra', mode: 'insensitive' } },
            { category: { contains: 'Puja', mode: 'insensitive' } },
          ],
        };
      } else if (catLower === 'singhasan') {
        categoryFilter = {
          OR: [
            { category: { contains: 'Singhasan', mode: 'insensitive' } },
            { category: { contains: 'Jhula', mode: 'insensitive' } },
            { category: { contains: 'Bed', mode: 'insensitive' } },
          ],
        };
      } else {
        categoryFilter = { category: { equals: category, mode: 'insensitive' } };
      }
    }
  
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
      totalCount: dataCount,
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
  
      revalidateTag('products', 'max');
      revalidatePath('/admin/products');
      revalidatePath('/');
  
      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      return { success: false, message: formatError(error) };
    }
  }
  
function normalizeProductPricing(product: any) {
  if (product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0) {
    const existingVariants = Array.isArray(product.sizeVariants) ? product.sizeVariants : [];
    const fallbackPrice = product.price && Number(product.price) > 0 ? String(product.price) : (product.originalPrice || '0');
    const fallbackOriginalPrice = product.originalPrice && Number(product.originalPrice) > 0 ? String(product.originalPrice) : fallbackPrice;

    const cleanedVariants = product.sizes.map((sz: string) => {
      const existing = existingVariants.find((v: any) => v.size === sz);
      const p = Number(existing?.price) || 0;
      const op = Number(existing?.originalPrice) || 0;
      const effectivePrice = p > 0 ? String(existing.price) : (op > 0 ? String(existing.originalPrice) : String(fallbackPrice));
      const effectiveOriginalPrice = op > 0 ? String(existing.originalPrice) : (p > 0 ? String(existing.price) : String(fallbackOriginalPrice));
      return {
        size: sz,
        price: effectivePrice,
        originalPrice: effectiveOriginalPrice,
        stock: existing?.stock !== undefined ? Number(existing.stock) : Number(product.stock || 0),
      };
    });
    product.sizeVariants = cleanedVariants;

    const validPrices = cleanedVariants
      .map((v: any) => Number(v.price))
      .filter((n: number) => !isNaN(n) && n > 0);

    if (validPrices.length > 0) {
      const minPrice = Math.min(...validPrices);
      const matchingVariant = cleanedVariants.find((v: any) => Number(v.price) === minPrice);
      const minOriginalPrice = matchingVariant?.originalPrice ? Number(matchingVariant.originalPrice) : minPrice;

      if (Number(product.price || 0) <= 0) {
        product.price = minPrice.toFixed(2);
        product.originalPrice = (minOriginalPrice || minPrice).toFixed(2);
        if (minOriginalPrice > minPrice) {
          product.discountPercent = Math.round(((minOriginalPrice - minPrice) / minOriginalPrice) * 100);
        } else {
          product.discountPercent = 0;
        }
      }
    }
  }
  return product;
}

// Create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized: Admin access required');
    const product = normalizeProductPricing(insertProductSchema.parse(data));
    await prisma.product.create({ data: product });

    revalidateTag('products', 'max');
    revalidatePath('/admin/products');
    revalidatePath('/');

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
    const product = normalizeProductPricing(updateProductSchema.parse(data));
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error('Product not found');

    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

    revalidateTag('products', 'max');
    revalidateTag(`product-${product.slug}`, 'max');
    revalidatePath('/admin/products');
    revalidatePath(`/product/${product.slug}`);
    revalidatePath('/');

    return {
      success: true,
      message: 'Product updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all categories (Cached in Server RAM with tag revalidation)
export async function getAllCategories() {
  const getCached = unstable_cache(
    async () => {
      const data = await prisma.product.groupBy({
        by: ['category'],
        _count: true,
      });
      return data;
    },
    ['all-categories'],
    { revalidate: 86400, tags: ['products', 'categories'] }
  );

  return getCached();
}

// Get featured products (Cached in Server RAM with tag revalidation)
export async function getFeaturedProducts() {
  const getCached = unstable_cache(
    async () => {
      const data = await prisma.product.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: 'desc' },
        take: 4,
      });
      return convertToPlainObject(data);
    },
    ['featured-products'],
    { revalidate: 3600, tags: ['products', 'featured-products'] }
  );

  return getCached();
}