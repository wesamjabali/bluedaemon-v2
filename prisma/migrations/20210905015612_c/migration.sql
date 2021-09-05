/*
  Warnings:

  - You are about to drop the column `codeAliases` on the `Course` table. All the data in the column will be lost.
  - Added the required column `guildId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "codeAliases",
ADD COLUMN     "courseCodeAliases" TEXT[],
ADD COLUMN     "guildId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Guild" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "currentQuarter" TEXT,
    "countingChannelId" TEXT,
    "courseRequestsChannelId" TEXT,
    "loggingChannelId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild.guildId_unique" ON "Guild"("guildId");

-- AddForeignKey
ALTER TABLE "Course" ADD FOREIGN KEY ("guildId") REFERENCES "Guild"("guildId") ON DELETE CASCADE ON UPDATE CASCADE;
