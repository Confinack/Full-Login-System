import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { OtpModule } from '../otp/otp.module.js';

@Module({
  imports: [DatabaseModule, OtpModule],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
