/*
  Warnings:

  - Added the required column `guildDbId` to the `Quarter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quarter" ADD COLUMN     "guildDbId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Quarter" ADD FOREIGN KEY ("guildDbId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
