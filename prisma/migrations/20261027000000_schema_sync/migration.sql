-- ==============================================================================
-- Migration: 20261027000000_schema_sync
-- Consolidates schema objects added via prisma db push into versioned migrations
-- Compatible with both clean local databases and existing Supabase instances
-- ==============================================================================

-- AlterTable Product: Add catalog & policy attributes
ALTER TABLE "Product"
    ADD COLUMN IF NOT EXISTS "originalPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "discountPercent" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "sizes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN IF NOT EXISTS "sizeVariants" JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS "isReturnable" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "returnPolicyText" TEXT,
    ADD COLUMN IF NOT EXISTS "returnWindowDays" INTEGER NOT NULL DEFAULT 0;

-- AlterTable User: Add phone auth, saved payment methods, and loyalty points
ALTER TABLE "User"
    ADD COLUMN IF NOT EXISTS "phoneNumber" TEXT,
    ADD COLUMN IF NOT EXISTS "addresses" JSONB[] DEFAULT ARRAY[]::JSONB[],
    ADD COLUMN IF NOT EXISTS "savedCards" JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS "savedUpiIds" JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS "bhaktiPoints" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "lifetimePoints" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'user_phone_idx') THEN
        CREATE UNIQUE INDEX "user_phone_idx" ON "User"("phoneNumber");
    END IF;
END $$;

-- AlterTable Cart: Add checkout & promotion fields
ALTER TABLE "Cart"
    ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT,
    ADD COLUMN IF NOT EXISTS "shippingAddress" JSON,
    ADD COLUMN IF NOT EXISTS "couponCode" TEXT,
    ADD COLUMN IF NOT EXISTS "discountPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "isGiftWrapped" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "giftCardAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "giftCardCode" TEXT,
    ADD COLUMN IF NOT EXISTS "pointsToRedeem" INTEGER NOT NULL DEFAULT 0;

-- AlterTable Order: Add logistics, fulfillment, tracking, and guest order support
ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL;

ALTER TABLE "Order"
    ADD COLUMN IF NOT EXISTS "awbNumber" TEXT,
    ADD COLUMN IF NOT EXISTS "refundStatus" TEXT,
    ADD COLUMN IF NOT EXISTS "returnReason" TEXT,
    ADD COLUMN IF NOT EXISTS "returnRequestedAt" TIMESTAMP(6),
    ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'PENDING',
    ADD COLUMN IF NOT EXISTS "trackingUrl" TEXT,
    ADD COLUMN IF NOT EXISTS "guestEmail" TEXT,
    ADD COLUMN IF NOT EXISTS "couponCode" TEXT,
    ADD COLUMN IF NOT EXISTS "discountPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "isGiftWrapped" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "giftCardAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "giftCardCode" TEXT,
    ADD COLUMN IF NOT EXISTS "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "pointsRedeemed" INTEGER NOT NULL DEFAULT 0;

-- AlterTable Review: Add customer review photos and verification
ALTER TABLE "Review"
    ADD COLUMN IF NOT EXISTS "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN IF NOT EXISTS "isVerifiedPurchase" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable Wishlist
CREATE TABLE IF NOT EXISTS "Wishlist" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Wishlist_userId_fkey') THEN
        ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Wishlist_productId_fkey') THEN
        ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'Wishlist_userId_productId_key') THEN
        CREATE UNIQUE INDEX "Wishlist_userId_productId_key" ON "Wishlist"("userId", "productId");
    END IF;
END $$;

-- CreateTable Coupon
CREATE TABLE IF NOT EXISTS "Coupon" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" DECIMAL(12,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxUses" INTEGER,
    "currentUses" INTEGER NOT NULL DEFAULT 0,
    "expiryDate" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'Coupon_code_key') THEN
        CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
    END IF;
END $$;

-- CreateTable GiftCard
CREATE TABLE IF NOT EXISTS "GiftCard" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" TEXT NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "initialValue" DECIMAL(12,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID,

    CONSTRAINT "GiftCard_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'GiftCard_code_key') THEN
        CREATE UNIQUE INDEX "GiftCard_code_key" ON "GiftCard"("code");
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'GiftCard_userId_fkey') THEN
        ALTER TABLE "GiftCard" ADD CONSTRAINT "GiftCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- CreateTable Banner
CREATE TABLE IF NOT EXISTS "Banner" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable BlogPost
CREATE TABLE IF NOT EXISTS "BlogPost" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "featuredImage" TEXT,
    "category" TEXT NOT NULL DEFAULT 'Devotional Seva',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "authorName" TEXT NOT NULL DEFAULT 'Madhav Shringaar',
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "readingTime" INTEGER NOT NULL DEFAULT 3,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "publishedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'blog_slug_idx') THEN
        CREATE UNIQUE INDEX "blog_slug_idx" ON "BlogPost"("slug");
    END IF;
END $$;
