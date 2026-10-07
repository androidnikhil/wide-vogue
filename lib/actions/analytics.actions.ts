'use server';

import { prisma } from '@/db/prisma';
import { auth } from '@/auth';

export async function getDashboardAnalytics() {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  // Basic totals
  const totalOrders = await prisma.order.count();
  const totalUsers = await prisma.user.count();
  
  const revenueAggregation = await prisma.order.aggregate({
    _sum: { totalPrice: true },
    where: { isPaid: true },
  });
  const totalRevenue = revenueAggregation._sum.totalPrice ? Number(revenueAggregation._sum.totalPrice) : 0;

  // Monthly Revenue for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const recentOrders = await prisma.order.findMany({
    where: {
      isPaid: true,
      createdAt: { gte: sixMonthsAgo },
    },
    select: {
      createdAt: true,
      totalPrice: true,
    }
  });

  const monthlyRevenueMap: Record<string, number> = {};
  recentOrders.forEach(order => {
    const month = order.createdAt.toLocaleString('default', { month: 'short' });
    if (!monthlyRevenueMap[month]) monthlyRevenueMap[month] = 0;
    monthlyRevenueMap[month] += Number(order.totalPrice);
  });

  const monthlyRevenue = Object.entries(monthlyRevenueMap).map(([name, total]) => ({
    name,
    total
  }));

  // Best selling products logic using OrderItem
  const orderItems = await prisma.orderItem.findMany({
    include: { product: { select: { category: true } } }
  });

  const productSalesMap: Record<string, { name: string, qty: number }> = {};
  const categorySalesMap: Record<string, number> = {};

  orderItems.forEach(item => {
    // Group by product
    if (!productSalesMap[item.name]) {
      productSalesMap[item.name] = { name: item.name, qty: 0 };
    }
    productSalesMap[item.name].qty += item.qty;

    // Group by category
    const cat = item.product?.category || 'Other';
    if (!categorySalesMap[cat]) {
      categorySalesMap[cat] = 0;
    }
    categorySalesMap[cat] += Number(item.price) * item.qty;
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const categoryRevenue = Object.entries(categorySalesMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return {
    totals: { totalOrders, totalUsers, totalRevenue },
    monthlyRevenue,
    topProducts,
    categoryRevenue
  };
}
