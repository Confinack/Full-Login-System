import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { UsersModule } from './users/users.module.js';
import { MailsenderModule } from './mailsender/mailsender.module.js';
import { OtpModule } from './otp/otp.module.js';

@Module({
  imports: [DatabaseModule, UsersModule, MailsenderModule, OtpModule]
})
export class AppModule {}
