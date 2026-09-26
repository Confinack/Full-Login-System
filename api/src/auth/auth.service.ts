import { Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { User } from "@prisma/client";

import { UsersService } from '../users/users.service.js';
import { OtpService } from '../otp/otp.service.js';

import { IRegisterUser } from '../users/dto/register-user.dto.js';
import { IFindUser } from '../users/dto/find-user.dto.js';
import { ILoginResponse } from './dto/login-response-auth.dto.js';
import { IVerifyOTP } from '../otp/dto/verify-otp.dto.js';

@Injectable()
export class AuthService {
    constructor(private readonly UserService: UsersService, private OTPService: OtpService){}

    async register(user_data: IRegisterUser): Promise<{user_with_otp?: User, message?: string}> {
        const user = await this.UserService.findByEmail(user_data.email);

        if(user) {
            if(!user.isVerified) {
                await this.UserService.update(user.id, {
                    name: user_data.name,
                    password: user_data.password,
                    createdAt: new Date()
                })

                const OTP_data = await this.OTPService.generateOTP(user.email);
                await this.UserService.update(user.id, {
                    OTP_CODE: OTP_data.code,
                    OTP_EXPIRY: OTP_data.expiryAt
                })

                const user_with_otp = await this.UserService.findByEmail(user.email);
                return {user_with_otp: user_with_otp!, message: "Usuário recadastrado com sucesso"};
            }

            throw new ConflictException("Usuário já cadastrado");
        }

        const {new_user, message} = await this.UserService.create(user_data);
        const OTP_data = await this.OTPService.generateOTP(new_user.email);
        await this.UserService.update(new_user.id, {
            OTP_CODE: OTP_data.code,
            OTP_EXPIRY: OTP_data.expiryAt
        })

        const user_with_otp = await this.UserService.findByEmail(new_user.email);
        return {user_with_otp: user_with_otp!, message};
    }

    async login(user_data: IFindUser): Promise<ILoginResponse> {
        const user = await this.UserService.findFirst(user_data);
        if(!user){throw new NotFoundException("Usuário não encontrado")}
        
        const {id, name, email, isVerified} = user;
        if (!isVerified) {throw new ForbiddenException("Usuário não passou pela validação de OTP")};

        return {id, name, email, isVerified};
    }

    async verify(data: IVerifyOTP): Promise<boolean> {
        const user = await this.UserService.findByEmail(data.email);
        if(!user){throw new NotFoundException("Usuário não encontrado")}

        const validation = await this.OTPService.verifyOTP(data);
        if(!validation){return false}

        await this.UserService.update(user.id, {OTP_CODE: null, OTP_EXPIRY: null, isVerified: true});
        return validation;
    }
}
