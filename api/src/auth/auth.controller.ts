import { 
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { IRegisterUser } from './dto/register-user.dto.ts';
import type { Response } from "express";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() data: IRegisterUser, @Res() response: Response): Promise<void> {
    const result = await this.authService.register(data);
    response.json(result);
  }
}
