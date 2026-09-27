import { 
  Controller,
  Get,
  Post,
  Param,
  Body,
  Res,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AuthService } from './auth.service.js';

import type { IRegisterUser } from '../users/dto/register-user.dto.js';
import type { IFindByCredentials } from '../users/dto/findByCredentials-user.dto.js';
import type { Response } from "express";
import type { IVerifyOTP } from '../otp/dto/verify-otp.dto.js';
import type { IResetPassword } from './dto/verify-password-reset-token.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){};

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() data: IRegisterUser, @Res() response: Response): Promise<void> {
    const result = await this.authService.register(data);
    response.json(result);
  };

  @Post("verify-otp")
  @HttpCode(HttpStatus.OK)
  async verify(@Body() data: IVerifyOTP, @Res() response: Response): Promise<void> {
    const result = await this.authService.verify(data);
    response.json(result);
  };

  @Post("login")
  @HttpCode(HttpStatus.FOUND)
  async login(@Body() data: IFindByCredentials, @Res() response: Response): Promise<void> {
    const result = await this.authService.login(data);
    response.json(result);
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() { email }: {email: string}, @Res() response: Response): Promise<void> {
    await this.authService.forgotPassword(email);
    response.end();
  }

  @Get("reset-password/verify/:token")
  @HttpCode(HttpStatus.OK)
  async verifyPasswordResetToken(@Param("token") token: string, @Res() response: Response): Promise<void> {
    const result = await this.authService.verifyPasswordResetToken(token);
    response.json({isValidToken: result});
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() data: IResetPassword, @Res() response: Response): Promise<void> {
    const result = await this.authService.resetPassword(data);
    response.json(result);
  }
}
