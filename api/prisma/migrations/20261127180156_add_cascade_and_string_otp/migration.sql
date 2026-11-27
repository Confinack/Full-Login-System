-- DropIndex
DROP INDEX `Otp_user_id_fkey` ON `otp`;

-- DropIndex
DROP INDEX `PasswordReset_user_id_fkey` ON `passwordreset`;

-- AlterTable
ALTER TABLE `otp` MODIFY `code` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Otp` ADD CONSTRAINT `Otp_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordReset` ADD CONSTRAINT `PasswordReset_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
