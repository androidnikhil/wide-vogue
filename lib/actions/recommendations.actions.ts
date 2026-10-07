'use server';

import { prisma } from '@/db/prisma';

export async function getRecommendedProducts(productId: string, category: string) {
  try {
    // Phase 1: Collaborative Filtering (Frequently Bought Together)
    // Find other orders that contain this product
    const ordersWithProduct = await prisma.orderItem.findMany({
      where: { productId },
      select: { orderId: true }
    });
    const orderIds = ordersWithProduct.map(oi => oi.orderId);

    // Find other products in those same orders
    const relatedOrderItems = await prisma.orderItem.findMany({
      where: {
        orderId: { in: orderIds },
        productId: { not: productId } // Exclude the current product
      },
      select: { productId: true }
    });

    // Count occurrences of each related product
    const productCounts: Record<string, number> = {};
    relatedOrderItems.forEach(item => {
      productCounts[item.productId] = (productCounts[item.productId] || 0) + 1;
    });

    // Get the most frequently bought together product IDs
    const recommendedIds = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1]) // Sort by frequency descending
      .slice(0, 4)
      .map(([id]) => id);

    // Fetch the actual product details for those IDs
    const collaborativeRecommendations = recommendedIds.length > 0 
      ? await prisma.product.findMany({
          where: { id: { in: recommendedIds } },
          take: 4,
        })
      : [];

    // Phase 2: Category/Content-Based Matching (Fallback/Supplement)
    // If we don't have enough collaborative data (e.g. new product), supplement with same category
    const remainingCount = 4 - collaborativeRecommendations.length;
    let contentRecommendations: any[] = [];
    
    if (remainingCount > 0) {
      contentRecommendations = await prisma.product.findMany({
        where: {
          category,
          id: { notIn: [productId, ...recommendedIds] },
        },
        take: remainingCount,
        orderBy: { rating: 'desc' } // Suggest highest rated in category
      });
    }

    // Combine both sets of recommendations
    const finalRecommendations = [...collaborativeRecommendations, ...contentRecommendations];
    
    return finalRecommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
}
