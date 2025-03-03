'use server'
import { prisma } from '@/db/prisma';
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCT_LIMIT } from "../constants";

export async function getLatestproduct() {
    const data = await prisma.product.findMany({
        take: LATEST_PRODUCT_LIMIT,
        orderBy: {
            createdAt: 'desc'
        }
    });
    return convertToPlainObject(data);
    
}

// Get  single product by it's slug

export async function getProductBySlug(slug: string) {
    const data = await prisma.product.findFirst({
        where: {
            slug
        }
    });
    return convertToPlainObject(data);
}