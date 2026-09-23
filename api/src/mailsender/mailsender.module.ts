import { Module } from '@nestjs/common';
import { MailsenderService } from './mailsender.service.js';

@Module({
  providers: [MailsenderService],
  exports: [MailsenderService]
})
export class MailsenderModule {}
