/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `PasswordReset` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Otp_user_id_fkey` ON `otp`;

-- DropIndex
DROP INDEX `PasswordReset_user_id_fkey` ON `passwordreset`;

-- CreateIndex
CREATE UNIQUE INDEX `PasswordReset_token_key` ON `PasswordReset`(`token`);

-- AddForeignKey
ALTER TABLE `Otp` ADD CONSTRAINT `Otp_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordReset` ADD CONSTRAINT `PasswordReset_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
