import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';

import { UsersModule } from '../users/users.module.js';
import { MailsenderModule } from '../mailsender/mailsender.module.js';
import { DatabaseModule } from '../database/database.module.js';
import { OtpModule } from '../otp/otp.module.js';

import { AuthService } from './auth.service.js';
import { PasswordresetService } from './passwordreset/passwordreset.service.js';

@Module({
  imports: [UsersModule, OtpModule, MailsenderModule, DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordresetService]
})
export class AuthModule {}
