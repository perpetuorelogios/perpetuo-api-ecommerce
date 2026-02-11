-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'seller', 'customer');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'customer';
