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

import { RegisterUserDTO } from '../users/dto/register-users.dto.js';
import { VerifyOtpDTO } from './otp/dto/verify-otp.dto.js';
import { LoginDTO } from './dto/login.dto.js';
import { ForgotPasswordDTO } from './dto/forgot-password.dto.js';
import { ResetPasswordDTO } from './password-reset/dto/verify-password-reset-token.dto.js';

import type { Response } from "express";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){};

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() data: RegisterUserDTO, @Res() response: Response): Promise<void> {
    const result = await this.authService.register(data);
    response.json(result);
  };

  @Post("verify-otp")
  @HttpCode(HttpStatus.OK)
  async verify(@Body() data: VerifyOtpDTO, @Res() response: Response): Promise<void> {
    const result = await this.authService.verifyAccount(data);
    response.json(result);
  };

  @Post("login")
  @HttpCode(HttpStatus.FOUND)
  async login(@Body() data: LoginDTO, @Res() response: Response): Promise<void> {
    const result = await this.authService.login(data);
    response.json(result);
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() { email }: ForgotPasswordDTO, @Res() response: Response): Promise<void> {
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
  async resetPassword(@Body() data: ResetPasswordDTO, @Res() response: Response): Promise<void> {
    const result = await this.authService.resetPassword(data);
    response.json(result);
  }
}
