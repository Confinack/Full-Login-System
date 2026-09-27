import {
    HttpException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    RequestTimeoutException
} from '@nestjs/common';

import * as crypto from "crypto";
import { IVerifyOTP } from './dto/verify-otp.dto.js';

import { MailsenderService } from "../mailsender/mailsender.service.js";
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class OtpService {
    private readonly otp_expiry_time_in_minutes = 10;
    constructor(private readonly MailService: MailsenderService, private readonly PrismaService: PrismaService){};

    async registerOTP(user_id: string, code: number, expiryAt: Date): Promise<void> {
        try {
            await this.PrismaService.otp.deleteMany({where: {user_id}})

            await this.PrismaService.otp.create({
                data: {
                    user_id,
                    code,
                    expiryAt
                }
            })
        } catch(E: any){
            throw new InternalServerErrorException("Erro ao tentar registrar código OTP");
        }
    }

    async generateOTP(user_id: string, email: string): Promise<void> {
        try {
            const code = crypto.randomInt(100000, 999999);
            const expiryAt = new Date();
            expiryAt.setTime(expiryAt.getTime() + (this.otp_expiry_time_in_minutes * 60 * 1000));

            await this.registerOTP(user_id, code, expiryAt);
            await this.MailService.sendEmail({
                to: email,
                subject: "OTP verification",
                text: `Your OTP code is ${code}`
            });
        } catch(E: any) {
            throw new InternalServerErrorException("Erro ao tentar gerar o código OTP");
        }
    }

    async verifyOTP({user_id, code}: IVerifyOTP): Promise<boolean> {
        try {
            const OTP = await this.PrismaService.otp.findFirst({where: {user_id}});
            if(!OTP) {throw new NotFoundException("Usuário não possuí código OTP")};
            console.log(code);
            const current_date = new Date();
            if (current_date > OTP.expiryAt){throw new RequestTimeoutException("Código OTP expirou")};
            if (OTP.code != code) {throw new ConflictException("Código OTP inválido")};

            return true;
        } catch(E: any) {
            if (E instanceof HttpException){
                throw E
            }
            throw new InternalServerErrorException("Erro inesperado ao validar OTP");
        }
    }
}
