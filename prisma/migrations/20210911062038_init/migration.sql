-- CreateTable
CREATE TABLE "Guild" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "guildOwnerId" TEXT NOT NULL,
    "currentQuarterId" INTEGER,
    "countingChannelId" TEXT,
    "courseRequestsChannelId" TEXT,
    "loggingChannelId" TEXT,
    "moderatorRoleId" TEXT,
    "courseManagerRoleId" TEXT,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "courseCodePrefix" TEXT NOT NULL,
    "courseCodeNumber" TEXT NOT NULL,
    "courseCodeSection" TEXT,
    "description" TEXT,
    "quarterId" INTEGER NOT NULL,
    "roleId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "category" BOOLEAN NOT NULL DEFAULT false,
    "owner" TEXT,
    "password" TEXT,
    "aliases" TEXT[],

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quarter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quarterCategoryChannelIds" TEXT[],
    "guilId" TEXT NOT NULL,

    CONSTRAINT "Quarter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_guildId_key" ON "Guild"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_roleId_key" ON "Course"("roleId");

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_currentQuarterId_fkey" FOREIGN KEY ("currentQuarterId") REFERENCES "Quarter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("guildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_quarterId_fkey" FOREIGN KEY ("quarterId") REFERENCES "Quarter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quarter" ADD CONSTRAINT "Quarter_guilId_fkey" FOREIGN KEY ("guilId") REFERENCES "Guild"("guildId") ON DELETE RESTRICT ON UPDATE CASCADE;
