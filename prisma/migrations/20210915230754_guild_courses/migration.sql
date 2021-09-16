-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "welcomeMessage" TEXT;

-- RenameIndex
ALTER INDEX "Course.roleId_unique" RENAME TO "Course_roleId_key";

-- RenameIndex
ALTER INDEX "Guild.guildId_unique" RENAME TO "Guild_guildId_key";
