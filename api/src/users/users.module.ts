import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { DatabaseModule } from '../database/database.module.js';
import { OtpModule } from '../otp/otp.module.js';

@Module({
  imports: [DatabaseModule, OtpModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
