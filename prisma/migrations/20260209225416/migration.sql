/*
  Warnings:

  - A unique constraint covering the columns `[productRequestId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ProductRequestStatus" AS ENUM ('pending', 'quoted', 'completed', 'canceled');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "isPreorder" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "productRequestId" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isPreorder" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ProductRequest" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "ProductRequestStatus" NOT NULL DEFAULT 'pending',
    "paymentLinkUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_productRequestId_key" ON "Order"("productRequestId");

-- AddForeignKey
ALTER TABLE "ProductRequest" ADD CONSTRAINT "ProductRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductRequest" ADD CONSTRAINT "ProductRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productRequestId_fkey" FOREIGN KEY ("productRequestId") REFERENCES "ProductRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
