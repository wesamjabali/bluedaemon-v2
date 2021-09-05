/*
  Warnings:

  - You are about to drop the column `currentQuarter` on the `Guild` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "currentQuarter",
ADD COLUMN     "currentQuarterName" TEXT;

-- AddForeignKey
ALTER TABLE "Guild" ADD FOREIGN KEY ("currentQuarterName") REFERENCES "Quarter"("name") ON DELETE SET NULL ON UPDATE CASCADE;
