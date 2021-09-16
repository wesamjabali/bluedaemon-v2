-- CreateTable
CREATE TABLE "SelfRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "SelfRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tagText" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SelfRole" ADD CONSTRAINT "SelfRole_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("guildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("guildId") ON DELETE RESTRICT ON UPDATE CASCADE;
