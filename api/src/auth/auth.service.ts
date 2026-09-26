import { Injectable, ForbiddenException, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { User } from "@prisma/client";

import { UsersService } from '../users/users.service.js';
import { OtpService } from '../otp/otp.service.js';

import { IRegisterUser } from '../users/dto/register-user.dto.js';
import { IFindByCredentials } from '../users/dto/findByCredentials-user.dto.js';
import { ILoginResponse } from './dto/login-response-auth.dto.js';
import { IVerifyOTP } from '../otp/dto/verify-otp.dto.js';

@Injectable()
export class AuthService {
    constructor(private readonly UserService: UsersService, private OTPService: OtpService){}

    async register(user_data: IRegisterUser): Promise<{user?: User, message?: string}> {
        const user = await this.UserService.findByEmail(user_data.email);

        if(user) {
            if(!user.isVerified) {
                await this.UserService.update(user.id, {
                    name: user_data.name,
                    password: user_data.password,
                    createdAt: new Date()
                })

                await this.OTPService.generateOTP(user.id, user.email);
                return {user, message: "Usuário recadastrado com sucesso"};
            }

            throw new ConflictException("Usuário já cadastrado");
        }

        const {new_user, message} = await this.UserService.create(user_data);
        await this.OTPService.generateOTP(new_user.id, new_user.email);
        
        return {user: new_user, message};
    }

    async verify(data: IVerifyOTP): Promise<boolean> {
        const user = await this.UserService.findFirst({id: data.user_id});
        if(!user){throw new NotFoundException("Usuário não encontrado")};
        if(user.isVerified){throw new BadRequestException("Usuário já validado")};

        const validation = await this.OTPService.verifyOTP(data);
        if(!validation){return false}

        await this.UserService.update(user.id, {isVerified: true});
        return validation;
    }

    async login(user_data: IFindByCredentials): Promise<ILoginResponse> {
        const user = await this.UserService.findByCredentials(user_data);
        if(!user){throw new NotFoundException("Usuário não encontrado")}
        
        const {id, name, email, isVerified} = user;
        if (!isVerified) {throw new ForbiddenException("Usuário não passou pela validação de OTP")};

        return {id, name, email, isVerified};
    }
}
