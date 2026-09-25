import { 
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { IRegisterUser } from '../users/dto/register-user.dto.js';
import type { IFindUser } from '../users/dto/find-user.dto.js';
import type { Response } from "express";
import type { IVerifyOTP } from '../otp/dto/verify-otp.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() data: IRegisterUser, @Res() response: Response): Promise<void> {
    const result = await this.authService.register(data);
    response.json(result);
  };

  @Post("login")
  @HttpCode(HttpStatus.FOUND)
  async login(@Body() data: IFindUser, @Res() response: Response): Promise<void> {
    const result = await this.authService.login(data);
    response.json(result);
  }

  @Post("verify-otp")
  @HttpCode(HttpStatus.OK)
  async verify(@Body() data: IVerifyOTP, @Res() response: Response): Promise<void> {
    const result = await this.authService.verify(data);
    response.json(result);
  }
}
