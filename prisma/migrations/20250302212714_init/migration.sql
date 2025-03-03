/*
  Warnings:

  - The `images` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "images",
ADD COLUMN     "images" TEXT[],
ALTER COLUMN "numReviews" SET DEFAULT 0,
ALTER COLUMN "isFeatured" SET DEFAULT false,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(6);
