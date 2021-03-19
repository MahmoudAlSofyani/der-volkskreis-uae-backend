/*
  Warnings:

  - The migration will change the primary key for the `user` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emailAddress` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobileNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authenticationToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User.email_unique` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `email`,
    DROP COLUMN `name`,
    ADD COLUMN     `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN     `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN     `emailAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN     `mobileNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN     `password` VARCHAR(191) NOT NULL,
    ADD COLUMN     `authenticationToken` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
