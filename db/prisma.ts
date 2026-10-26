import { PrismaClient } from '@prisma/client';

function getDatabaseUrl(): string | undefined {
  // Prioritize verified Supabase pooler URL from Vercel integration, fallback to DATABASE_URL
  let url = (process.env.ms_POSTGRES_PRISMA_URL || process.env.DATABASE_URL || '').replace(/^["']|["']$/g, '').trim();

  // If URL points to the direct Supabase host (IPv6 only, unreachable from Vercel Lambda),
  // automatically redirect to the IPv4 connection pooler
  if (
    url.includes('.supabase.co') &&
    process.env.ms_POSTGRES_PRISMA_URL
  ) {
    url = process.env.ms_POSTGRES_PRISMA_URL.replace(/^["']|["']$/g, '').trim();
  }

  // Ensure pgbouncer, connection_limit, and healthy timeouts are configured for Supabase pooler on port 6543
  if (url.includes('6543')) {
    if (!url.includes('pgbouncer=true')) {
      url += (url.includes('?') ? '&' : '?') + 'pgbouncer=true';
    }
    if (!url.includes('connection_limit=')) {
      url += '&connection_limit=1';
    }
    if (!url.includes('connect_timeout=')) {
      url += '&connect_timeout=15';
    }
    if (!url.includes('pool_timeout=')) {
      url += '&pool_timeout=15';
    }
  }

  return url || undefined;
}

function createPrismaClient() {
  const url = getDatabaseUrl();
  if (process.env.NODE_ENV === 'production') {
    const masked = url ? url.replace(/:[^:@]+@/, ':****@') : 'NONE';
    console.log('[Prisma Init] Target database URL:', masked);
  }

  const basePrisma = new PrismaClient(
    url
      ? {
          datasources: {
            db: {
              url,
            },
          },
        }
      : undefined
  );

  // Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
  return basePrisma.$extends({
    result: {
      product: {
        price: {
          needs: { price: true },
          compute(product) {
            return product.price?.toString() ?? '0';
          },
        },
        rating: {
          needs: { rating: true },
          compute(product) {
            return product.rating?.toString() ?? '0';
          },
        },
      },
      cart: {
        itemsPrice: {
          needs: { itemsPrice: true },
          compute(cart) {
            return cart.itemsPrice.toString();
          },
        },
        shippingPrice: {
          needs: { shippingPrice: true },
          compute(cart) {
            return cart.shippingPrice.toString();
          },
        },
        taxPrice: {
          needs: { taxPrice: true },
          compute(cart) {
            return cart.taxPrice.toString();
          },
        },
        totalPrice: {
          needs: { totalPrice: true },
          compute(cart) {
            return cart.totalPrice.toString();
          },
        },
      },
      order: {
        itemsPrice: {
          needs: { itemsPrice: true },
          compute(cart) {
            return cart.itemsPrice.toString();
          },
        },
        shippingPrice: {
          needs: { shippingPrice: true },
          compute(cart) {
            return cart.shippingPrice.toString();
          },
        },
        taxPrice: {
          needs: { taxPrice: true },
          compute(cart) {
            return cart.taxPrice.toString();
          },
        },
        totalPrice: {
          needs: { totalPrice: true },
          compute(cart) {
            return cart.totalPrice.toString();
          },
        },
      },
      orderItem: {
        price: {
          compute(cart) {
            return cart.price.toString();
          },
        },
      },
    },
  });
}

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

export const prisma: ExtendedPrismaClient = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;