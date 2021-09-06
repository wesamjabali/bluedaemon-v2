/*
  Warnings:

  - You are about to drop the column `quarterName` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `currentQuarterName` on the `Guild` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[currentQuarterId]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `quarterId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_quarterName_fkey";

-- DropForeignKey
ALTER TABLE "Guild" DROP CONSTRAINT "Guild_currentQuarterName_fkey";

-- DropIndex
DROP INDEX "Quarter.name_unique";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "quarterName",
ADD COLUMN     "quarterId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "currentQuarterName",
ADD COLUMN     "currentQuarterId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Guild_currentQuarterId_unique" ON "Guild"("currentQuarterId");

-- AddForeignKey
ALTER TABLE "Guild" ADD FOREIGN KEY ("currentQuarterId") REFERENCES "Quarter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD FOREIGN KEY ("quarterId") REFERENCES "Quarter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
