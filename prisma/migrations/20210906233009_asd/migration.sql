/*
  Warnings:

  - You are about to drop the column `guildDbId` on the `Quarter` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quarter" DROP CONSTRAINT "Quarter_guildDbId_fkey";

-- AlterTable
ALTER TABLE "Quarter" DROP COLUMN "guildDbId";
