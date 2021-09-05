/*
  Warnings:

  - You are about to drop the column `roleId` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "roleId",
ADD COLUMN     "roleIds" TEXT[];
