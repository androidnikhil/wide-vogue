import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL && process.env.ms_POSTGRES_PRISMA_URL) {
  process.env.DATABASE_URL = process.env.ms_POSTGRES_PRISMA_URL;
}
if (!process.env.DIRECT_URL && process.env.ms_POSTGRES_URL_NON_POOLING) {
  process.env.DIRECT_URL = process.env.ms_POSTGRES_URL_NON_POOLING;
}

const databaseUrl = process.env.DATABASE_URL || process.env.ms_POSTGRES_PRISMA_URL;

function createPrismaClient() {
  const basePrisma = new PrismaClient(
    databaseUrl
      ? {
          datasources: {
            db: {
              url: databaseUrl,
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