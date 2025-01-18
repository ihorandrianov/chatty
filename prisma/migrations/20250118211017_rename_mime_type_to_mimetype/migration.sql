/*
  Warnings:

  - You are about to drop the column `mimeType` on the `Messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "mimeType",
ADD COLUMN     "mimetype" TEXT;
