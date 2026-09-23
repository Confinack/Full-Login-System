import { Module } from '@nestjs/common';
import { OtpService } from './otp.service.js';
import { MailsenderModule } from '../mailsender/mailsender.module.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [MailsenderModule, DatabaseModule],
  providers: [OtpService],
  exports: [OtpService]
})
export class OtpModule {}
