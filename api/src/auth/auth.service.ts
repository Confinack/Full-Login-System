import { 
    Injectable, 
    ForbiddenException, 
    NotFoundException, 
    ConflictException, 
    BadRequestException, 
    UnauthorizedException
} from '@nestjs/common';

import bcrypt from "bcrypt";

import { UsersService } from '../users/users.service.js';
import { OtpService } from './otp/otp.service.js';

import { RegisterUserDTO } from '../users/dto/register-users.dto.js';
import { VerifyOtpDTO } from './otp/dto/verify-otp.dto.js';
import { LoginDTO } from './dto/login.dto.js';
import { ResetPasswordDTO } from './password-reset/dto/verify-password-reset-token.dto.js';

import { ILoginResponse } from './dto/login-response.dto.js';
import { PasswordresetService } from './password-reset/password-reset.service.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService, 
        private readonly otpService: OtpService,
        private readonly passwordResetService: PasswordresetService
    ){};

    async register(data: RegisterUserDTO): Promise<{user?: {id: string, email: string}, message?: string}> {
        const previous_user = await this.userService.findFirst({email: data.email});
        if(previous_user && previous_user.isVerified){throw new ConflictException("Usuário já cadastrado")}
        
        const password_hash = await bcrypt.hash(data.password, 12);
        if(previous_user) {
            await this.userService.update(previous_user.id, {
                name: data.name,
                password: password_hash
            });

            await this.otpService.generateOTP(previous_user.id, previous_user.email);
            return {user: {id: previous_user.id, email: previous_user.email}, message: "Usuário recadastrado com sucesso"};
        };


        const {user, message} = await this.userService.create({ ...data, password: password_hash });
        await this.otpService.generateOTP(user.id, user.email);
        
        return {user, message};
    }

    async verifyAccount(data: VerifyOtpDTO): Promise<{status: boolean, message: string}> {
        const user = await this.userService.findFirst({id: data.user_id});
        
        if(!user){throw new NotFoundException("Usuário não encontrado")};
        if(user.isVerified){throw new BadRequestException("Usuário já validado")};

        const validation = await this.otpService.verifyOTP(data);
        if(!validation){return {status: validation, message: "Erro ao verificar usuário"}};

        await this.userService.update(user.id, {isVerified: true});
        await this.otpService.deleteOTP(data);
        return {status: validation, message: "Usuário verificado com sucesso"};
    }

    async login(data: LoginDTO): Promise<ILoginResponse> {
        const user = await this.userService.findByEmailWithPassword(data.email);
        const correctPassword = user?.password && await bcrypt.compare(data.password, user.password);
        
        if(!user || !correctPassword){throw new UnauthorizedException("Usuário ou senha incorretos")};
        
        const {password, ...safeUser} = user;
        if (!safeUser.isVerified){throw new ForbiddenException("Usuário não passou pela validação de OTP")};
        
        return safeUser;
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.userService.findFirst({email});
        if(!user){return};

        await this.passwordResetService.generatePasswordResetToken({user_id: user.id, to: email});
    }

    async verifyPasswordResetToken(token: string): Promise<boolean> {
        const {user_id, isTokenValid} = await this.passwordResetService.verifyToken(token);
        return isTokenValid;
    }

    async resetPassword({token, password, confirmPassword}: ResetPasswordDTO): Promise<{message: string}> {
        const {user_id, isTokenValid} = await this.passwordResetService.verifyToken(token);
        
        if(!isTokenValid){throw new BadRequestException("Dados inválidos")};
        if(!user_id){throw new NotFoundException("Usuário não encontrado")};
        if(password != confirmPassword){throw new BadRequestException("Credenciais inválidas ao tentar resetar a senha")};
        
        const password_hash = await bcrypt.hash(password, 12);
        await this.userService.update(user_id, {password: password_hash});
        await this.passwordResetService.deleteToken(token);
        return {message: "Senha atualizada com sucesso"};
    }
}
