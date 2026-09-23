/*
  Warnings:

  - Added the required column `OTP_CODE` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `OTP_CODE` INTEGER NOT NULL,
    ADD COLUMN `OTP_EXPIRY` DATETIME(3) NOT NULL DEFAULT (NOW() + INTERVAL 3 HOUR),
    ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false;
