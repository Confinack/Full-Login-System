import { Injectable } from '@nestjs/common';
import { Prisma, User } from "@prisma/client";
import { UsersService } from '../users/users.service.js';
import { OtpService } from '../otp/otp.service.js';
import { IRegisterUser } from './dto/register-user.dto.js';

@Injectable()
export class AuthService {
    constructor(private readonly UserService: UsersService, private OTPService: OtpService){}

    async register(user_data: IRegisterUser): Promise<{new_user: User, message?: string}> {
        const server_response = await this.UserService.create(user_data);
        await this.OTPService.sendOTP(server_response.new_user.email)

        return server_response;
    }
}
