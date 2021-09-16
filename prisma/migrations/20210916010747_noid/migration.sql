/*
  Warnings:

  - The primary key for the `Guild` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Guild` table. All the data in the column will be lost.
  - The primary key for the `SelfRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SelfRole` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roleId]` on the table `SelfRole` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Guild" DROP CONSTRAINT "Guild_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Guild_pkey" PRIMARY KEY ("guildId");

-- AlterTable
ALTER TABLE "SelfRole" DROP CONSTRAINT "SelfRole_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "SelfRole_pkey" PRIMARY KEY ("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "SelfRole_roleId_key" ON "SelfRole"("roleId");
