/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "password" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "QueueFailedJob" (
    "id" TEXT NOT NULL,
    "queue" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "error" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "QueueFailedJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueProcessedEvent" (
    "id" TEXT NOT NULL,
    "queue" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "QueueProcessedEvent_pkey" PRIMARY KEY ("id")
);
