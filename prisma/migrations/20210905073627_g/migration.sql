/*
  Warnings:

  - You are about to drop the `CourseLink` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseLink" DROP CONSTRAINT "CourseLink_roleId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "aliases" TEXT[];

-- DropTable
DROP TABLE "CourseLink";
