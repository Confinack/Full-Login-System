import { 
    Injectable, 
    ForbiddenException, 
    NotFoundException, 
    ConflictException, 
    BadRequestException 
} from '@nestjs/common';

import bcrypt from "bcrypt";

import { UsersService } from '../users/users.service.js';
import { OtpService } from './otp/otp.service.js';

import { IRegisterUser } from '../users/dto/create-users.dto.js';
import { ILogin } from './dto/login.dto.js';
import { ILoginResponse } from './dto/login-response.dto.js';
import { IVerifyOTP } from './otp/dto/verify-otp.dto.js';
import { PasswordresetService } from './password-reset/password-reset.service.js';
import { IResetPassword } from './password-reset/dto/verify-password-reset-token.dto.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService, 
        private readonly otpService: OtpService,
        private readonly passwordResetService: PasswordresetService
    ){};

    async register(data: IRegisterUser): Promise<{user?: {id: string, email: string}, message?: string}> {
        const previous_user = await this.userService.findFirst({email: data.email});
        const password_hash = await bcrypt.hash(data.password, 12);

        if(previous_user) {
            if(!previous_user.isVerified) {
                await this.userService.update(previous_user.id, {
                    name: data.name,
                    password: password_hash
                });

                await this.otpService.generateOTP(previous_user.id, previous_user.email);
                return {user: {id: previous_user.id, email: previous_user.email}, message: "Usuário recadastrado com sucesso"};
            };

            throw new ConflictException("Usuário já cadastrado");
        };

        const {user, message} = await this.userService.create({ ...data, password: password_hash });
        await this.otpService.generateOTP(user.id, user.email);
        
        return {user, message};
    }

    async verifyAccount(data: IVerifyOTP): Promise<{status: boolean, message: string}> {
        const user = await this.userService.findFirst({id: data.user_id});
        
        if(!user){throw new NotFoundException("Usuário não encontrado")};
        if(user.isVerified){throw new BadRequestException("Usuário já validado")};

        const validation = await this.otpService.verifyOTP(data);
        if(!validation){return {status: validation, message: "Erro ao verificar usuário"}};

        await this.userService.update(user.id, {isVerified: true});
        return {status: validation, message: "Usuário verificado com sucesso"};
    }

    async login(data: ILogin): Promise<ILoginResponse> {
        const user = await this.userService.findByEmailWithPassword(data.email);
        if(!user){throw new NotFoundException("Usuário não encontrado")};

        const correctPassword = await bcrypt.compare(data.password, user.password);
        if(!correctPassword){throw new NotFoundException("Usuário ou senha incorretos")};

        const {id, name, email, isVerified} = user;
        if (!isVerified){throw new ForbiddenException("Usuário não passou pela validação de OTP")};

        return {id, name, email, isVerified};
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.userService.findFirst({email});
        if(!user){throw new NotFoundException("Usuário não encontrado")};

        await this.passwordResetService.generatePasswordResetToken({user_id: user.id, to: email});
    }

    async verifyPasswordResetToken(token: string): Promise<boolean> {
        const {user_id, isTokenValid} = await this.passwordResetService.verifyToken(token);
        return isTokenValid;
    }

    async resetPassword({token, password, confirmPassword}: IResetPassword): Promise<{message: string}> {
        const {user_id, isTokenValid} = await this.passwordResetService.verifyToken(token);
        
        if(!isTokenValid){throw new ConflictException("Dados inválidos")};
        if(!user_id){throw new NotFoundException("Usuário não encontrado")};
        if(password != confirmPassword){throw new ConflictException("Credenciais inválidas ao tentar resetar a senha")};
        
        const password_hash = await bcrypt.hash(password, 12);
        await this.userService.update(user_id, {password: password_hash});
        await this.passwordResetService.deleteToken(token);
        return {message: "Senha atualizada com sucesso"};
    }
}
