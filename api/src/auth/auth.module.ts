import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersModule } from '../users/users.module.js';
import { OtpModule } from '../otp/otp.module.js';

@Module({
  imports: [UsersModule, OtpModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
