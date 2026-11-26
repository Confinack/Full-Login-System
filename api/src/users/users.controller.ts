import { 
    Controller,
    Delete,
    Param,
    Res,
    HttpCode,
    HttpStatus
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import type { Response } from "express";

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param("id") id: string, @Res() response: Response): Promise<void>{
        await this.userService.delete(id);
        response.end();
    }
}
