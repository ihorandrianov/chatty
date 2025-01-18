-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('FILE', 'TEXT');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "contentType" "ContentType" NOT NULL,
    "content" TEXT NOT NULL,
    "usersId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_login_key" ON "Users"("login");

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
