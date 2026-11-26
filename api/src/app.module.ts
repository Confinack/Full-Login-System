import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { UsersModule } from './users/users.module.js';
import { MailsenderModule } from './mail-sender/mailsender.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [DatabaseModule, UsersModule, MailsenderModule, AuthModule]
})
export class AppModule {}
