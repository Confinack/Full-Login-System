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

import { MailsenderService } from "../../mail-sender/mailsender.service.js";
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class OtpService {
    private readonly otp_expiry_time_in_minutes = 10;
    constructor(private readonly mailService: MailsenderService, private readonly prismaService: PrismaService){};

    async registerOTP(user_id: string, code: number, expiryAt: Date): Promise<void> {
        await this.prismaService.otp.deleteMany({where: {user_id}});

        await this.prismaService.otp.create({
            data: {
                user_id,
                code,
                expiryAt
            }
        });
    }

    async generateOTP(user_id: string, email: string): Promise<void> {
        const code = crypto.randomInt(100000, 999999);
        const expiryAt = new Date();
        expiryAt.setTime(expiryAt.getTime() + (this.otp_expiry_time_in_minutes * 60 * 1000));

        await this.registerOTP(user_id, code, expiryAt);
        await this.mailService.sendEmail({
            to: email,
            subject: "OTP verification",
            text: `Your OTP code is ${code}`
        });
    }

    async verifyOTP({user_id, code}: IVerifyOTP): Promise<boolean> {
        const OTP = await this.prismaService.otp.findFirst({where: {user_id}});
        if(!OTP) {throw new NotFoundException("Usuário não possuí código OTP")};

        const current_date = new Date();
        if (current_date > OTP.expiryAt){throw new RequestTimeoutException("Código OTP expirou")};
        if (OTP.code != code) {throw new ConflictException("Código OTP inválido")};

        return true;
    }

    async deleteOTP({user_id, code}: IVerifyOTP): Promise<void> {
        await this.prismaService.otp.deleteMany({where: {user_id, code}});   
    }
}
