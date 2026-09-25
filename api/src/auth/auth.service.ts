import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from "@prisma/client";
import { UsersService } from '../users/users.service.js';
import { OtpService } from '../otp/otp.service.js';
import { IRegisterUser } from '../users/dto/register-user.dto.js';
import { IFindUser } from '../users/dto/find-user.dto.js';
import { ILoginResponse } from './dto/login-response.dto.js';

@Injectable()
export class AuthService {
    constructor(private readonly UserService: UsersService, private OTPService: OtpService){}

    async register(user_data: IRegisterUser): Promise<{new_user: User, message?: string}> {
        const server_response = await this.UserService.create(user_data);
        await this.OTPService.sendOTP(server_response.new_user.email)
        
        return server_response;
    }

    async login(user_data: IFindUser): Promise<ILoginResponse> {
        const {id, name, email, isVerified} = await this.UserService.findFirst(user_data);
        if (!isVerified) {throw new ForbiddenException()};

        return {id, name, email, isVerified};
    }
}
