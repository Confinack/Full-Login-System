import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from "@prisma/client";

import { UsersService } from '../users/users.service.js';
import { OtpService } from '../otp/otp.service.js';

import { IRegisterUser } from '../users/dto/register-user.dto.js';
import { IFindUser } from '../users/dto/find-user.dto.js';
import { ILoginResponse } from './dto/login-response.dto.js';
import { IVerifyOTP } from '../otp/dto/verify-otp.dto.js';

@Injectable()
export class AuthService {
    constructor(private readonly UserService: UsersService, private OTPService: OtpService){}

    async register(user_data: IRegisterUser): Promise<{user: User, message?: string}> {
        const {new_user, message} = await this.UserService.create(user_data);
        const OTP_data = await this.OTPService.generateOTP(new_user.email);
        await this.UserService.update(new_user.id, {
            OTP_CODE: OTP_data.code,
            OTP_EXPIRY: OTP_data.expiryAt
        })

        const user = await this.UserService.findByEmail(new_user.email);
        return {user, message};
    }

    async login(user_data: IFindUser): Promise<ILoginResponse> {
        const {id, name, email, isVerified} = await this.UserService.findFirst(user_data);
        if (!isVerified) {throw new ForbiddenException()};

        return {id, name, email, isVerified};
    }

    async verify(data: IVerifyOTP): Promise<boolean> {
        const user = await this.UserService.findByEmail(data.email);
        const validation = await this.OTPService.verifyOTP(data);
        if(!validation){return false}

        await this.UserService.update(user.id, {isVerified: true});
        return validation;
    }
}
