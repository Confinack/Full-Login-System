import { 
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res
} 
from '@nestjs/common';
import { UsersService } from './users.service.js';
import { Prisma, User } from "@prisma/client";
import { IApiResponse } from "../types/apiResponse.js";
import { CreateUserDto, FindUserDto, UpdateUserDto } from "../dtos/UserDto.dto.js";
import type { Response } from "express";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  async signup(@Body() body: CreateUserDto, @Res() res: Response): Promise<IApiResponse> {
    const response = await this.usersService.signup(body);
    res.status(response.status).send(response);
    return response;
  }

  @Post("login")
  async signin(@Body() body: FindUserDto, @Res() res: Response): Promise<IApiResponse> {
    const response = await this.usersService.signin(body);
    res.status(response.status).send(response);
    return response;
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() body: UpdateUserDto, @Res() res: Response): Promise<IApiResponse> {
    const response = await this.usersService.update(id, body);
    res.status(response.status).send(response);
    return response;
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @Res() res: Response): Promise<IApiResponse> {
    const response = await this.usersService.delete(id);
    res.status(response.status).send(response);
    return response;
  }
}
