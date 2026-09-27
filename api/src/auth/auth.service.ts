import { 
    Injectable, 
    ForbiddenException, 
    NotFoundException, 
    ConflictException, 
    BadRequestException 
} from '@nestjs/common';
import { User } from "@prisma/client";

import { UsersService } from '../users/users.service.js';
import { OtpService } from '../otp/otp.service.js';

import { IRegisterUser } from '../users/dto/register-user.dto.js';
import { IFindByCredentials } from '../users/dto/findByCredentials-user.dto.js';
import { ILoginResponse } from './dto/login-response-auth.dto.js';
import { IVerifyOTP } from '../otp/dto/verify-otp.dto.js';
import { PasswordresetService } from './passwordreset/passwordreset.service.js';
import { IResetPassword } from './dto/verify-password-reset-token.dto.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly UserService: UsersService, 
        private readonly OTPService: OtpService,
        private readonly PasswordResetService: PasswordresetService
    ){};

    async register(data: IRegisterUser): Promise<{user?: User, message?: string}> {
        const user = await this.UserService.findFirst({email: data.email});

        if(user) {
            if(!user.isVerified) {
                await this.UserService.update(user.id, {
                    name: data.name,
                    password: data.password,
                    createdAt: new Date()
                });

                await this.OTPService.generateOTP(user.id, user.email);
                return {user, message: "Usuário recadastrado com sucesso"};
            };

            throw new ConflictException("Usuário já cadastrado");
        };

        const {new_user, message} = await this.UserService.create(data);
        await this.OTPService.generateOTP(new_user.id, new_user.email);
        
        return {user: new_user, message};
    }

    async verify(data: IVerifyOTP): Promise<{status: boolean, message: string}> {
        const user = await this.UserService.findFirst({id: data.user_id});
        if(!user){throw new NotFoundException("Usuário não encontrado")};
        if(user.isVerified){throw new BadRequestException("Usuário já validado")};

        const validation = await this.OTPService.verifyOTP(data);
        if(!validation){return {status: validation, message: "Erro ao verificar usuário"}};

        await this.UserService.update(user.id, {isVerified: true});
        return {status: validation, message: "Usuário verificado com sucesso"};
    }

    async login(data: IFindByCredentials): Promise<ILoginResponse> {
        const user = await this.UserService.findByCredentials(data);
        if(!user){throw new NotFoundException("Usuário não encontrado")};
        
        const {id, name, email, isVerified} = user;
        if (!isVerified){throw new ForbiddenException("Usuário não passou pela validação de OTP")};

        return {id, name, email, isVerified};
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.UserService.findFirst({email});
        if(!user){throw new NotFoundException("Usuário não encontrado")};

        await this.PasswordResetService.generatePasswordResetToken({user_id: user.id, to: email});
    }

    async verifyPasswordResetToken(token: string): Promise<boolean> {
        const {user_id, isTokenValid} = await this.PasswordResetService.verifyToken(token);
        return isTokenValid;
    }

    async resetPassword(data: IResetPassword): Promise<{message: string}> {
        const {user_id, isTokenValid} = await this.PasswordResetService.verifyToken(data.token);
        
        if(!isTokenValid){throw new ConflictException("Dados inválidos")};
        if(!user_id){throw new NotFoundException("Usuário não encontrado")};
        if(data.password != data.confirmPassword){throw new ConflictException("Credenciais inválidas ao tentar resetar a senha")};
        
        await this.UserService.update(user_id, {password: data.password});
        return {message: "Senha atualizada com sucesso"};
    }
}
