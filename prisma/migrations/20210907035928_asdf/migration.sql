/*
  Warnings:

  - Added the required column `guilId` to the `Quarter` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Guild_currentQuarterId_unique";

-- AlterTable
ALTER TABLE "Quarter" ADD COLUMN     "guilId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Quarter" ADD FOREIGN KEY ("guilId") REFERENCES "Guild"("guildId") ON DELETE CASCADE ON UPDATE CASCADE;
