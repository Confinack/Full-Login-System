import { Module } from '@nestjs/common';
import { OtpService } from './otp.service.js';
import { MailsenderModule } from '../mail-sender/mailsender.module.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [MailsenderModule, DatabaseModule],
  providers: [OtpService],
  exports: [OtpService]
})
export class OtpModule {}
