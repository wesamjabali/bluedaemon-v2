/*
  Warnings:

  - You are about to drop the column `categoryOwner` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "categoryOwner",
ADD COLUMN     "owner" TEXT;
