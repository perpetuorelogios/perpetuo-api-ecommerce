/*
  Warnings:

  - A unique constraint covering the columns `[paymentLinkId]` on the table `ProductRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentLinkBillingType" AS ENUM ('UNDEFINED', 'CREDIT_CARD', 'BOLETO', 'PIX', 'TRANSFER');

-- CreateEnum
CREATE TYPE "PaymentLinkChargeType" AS ENUM ('DETACHED', 'INSTALLMENT', 'RECURRENT');

-- CreateEnum
CREATE TYPE "PaymentLinkSubscriptionCycle" AS ENUM ('MONTHLY', 'WEEKLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "PaymentLinkStatus" AS ENUM ('pending', 'paid', 'failed', 'canceled');

-- AlterTable
ALTER TABLE "ProductRequest" ADD COLUMN     "paymentLinkId" TEXT;

-- CreateTable
CREATE TABLE "PaymentLink" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "value" DECIMAL(65,30) NOT NULL,
    "billingType" "PaymentLinkBillingType" NOT NULL,
    "chargeType" "PaymentLinkChargeType" NOT NULL,
    "dueDateLimitDays" INTEGER,
    "maxInstallmentCount" INTEGER,
    "subscriptionCycle" "PaymentLinkSubscriptionCycle",
    "notificationEnabled" BOOLEAN DEFAULT true,
    "status" "PaymentLinkStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PaymentLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentLink_providerId_key" ON "PaymentLink"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductRequest_paymentLinkId_key" ON "ProductRequest"("paymentLinkId");

-- AddForeignKey
ALTER TABLE "ProductRequest" ADD CONSTRAINT "ProductRequest_paymentLinkId_fkey" FOREIGN KEY ("paymentLinkId") REFERENCES "PaymentLink"("id") ON DELETE SET NULL ON UPDATE CASCADE;
