-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "aliases" TEXT[],
    "description" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "category" BOOLEAN NOT NULL DEFAULT false,
    "categoryOwner" TEXT,
    "password" TEXT,

    PRIMARY KEY ("id")
);
