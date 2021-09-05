/*
  Warnings:

  - You are about to drop the column `roleIds` on the `Course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roleId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roleId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "roleIds",
ADD COLUMN     "roleId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CourseLink" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course.roleId_unique" ON "Course"("roleId");

-- AddForeignKey
ALTER TABLE "CourseLink" ADD FOREIGN KEY ("roleId") REFERENCES "Course"("roleId") ON DELETE CASCADE ON UPDATE CASCADE;
