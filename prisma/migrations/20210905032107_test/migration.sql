/*
  Warnings:

  - You are about to drop the column `courseCodeAliases` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `quarter` on the `Course` table. All the data in the column will be lost.
  - Added the required column `courseCodeNumber` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseCodePrefix` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quarterName` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "courseCodeAliases",
DROP COLUMN "quarter",
ADD COLUMN     "courseCodeNumber" TEXT NOT NULL,
ADD COLUMN     "courseCodePrefix" TEXT NOT NULL,
ADD COLUMN     "courseCodeSection" TEXT,
ADD COLUMN     "quarterName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Quarter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quarterCategoryChannelIds" TEXT[],

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quarter.name_unique" ON "Quarter"("name");

-- AddForeignKey
ALTER TABLE "Course" ADD FOREIGN KEY ("quarterName") REFERENCES "Quarter"("name") ON DELETE CASCADE ON UPDATE CASCADE;
