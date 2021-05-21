/*
  Warnings:

  - You are about to drop the column `Comment` on the `comment` table. All the data in the column will be lost.
  - Added the required column `comment` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `advertisement` ADD COLUMN     `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `comment` DROP COLUMN `Comment`,
    ADD COLUMN     `comment` TEXT NOT NULL;
