/*
  Warnings:

  - You are about to drop the column `usersId` on the `Messages` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_usersId_fkey";

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "usersId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
