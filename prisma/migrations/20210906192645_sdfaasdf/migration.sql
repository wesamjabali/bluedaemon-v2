/*
  Warnings:

  - Added the required column `guildOwnerId` to the `Guild` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "guildOwnerId" TEXT NOT NULL;
