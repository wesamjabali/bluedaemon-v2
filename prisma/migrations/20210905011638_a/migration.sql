/*
  Warnings:

  - You are about to drop the column `aliases` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "aliases",
ADD COLUMN     "codeAliases" TEXT[];
