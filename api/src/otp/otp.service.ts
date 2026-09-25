import { 
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';

import * as crypto from "crypto";
import { IOTPData } from './dto/otp-data.dto.js';
import { IVerifyOTP } from './dto/verify-otp.dto.js';

import { MailsenderService } from "../mailsender/mailsender.service.js";
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class OtpService {
    // 30 minutos;
    private readonly otp_expiry_time = (30 * 60 * 1000);
    constructor(private readonly MailService: MailsenderService, private readonly PrismaService: PrismaService){};

    async generateOTP(email: string): Promise<IOTPData> {
        try {
            const code = crypto.randomInt(100000, 999999);
            const current_date = new Date();
            current_date.setTime(current_date.getTime() + this.otp_expiry_time);

            await this.MailService.sendEmail({
                to: email,
                subject: "OTP verification",
                text: `Your OTP code is ${code}`
            });

            return {
                code,
                expiryAt: current_date
            };
        } catch(E: any) {
            throw new InternalServerErrorException();
        }
    }

    async verifyOTP({email, code}: IVerifyOTP): Promise<boolean> {
        try {
            const user = await this.PrismaService.user.findFirst({where: {email}})
            if (!user) {throw new NotFoundException()}
            if (user.OTP_CODE != code) {throw new ConflictException()}
            
            return true;
        } catch(E: any) {
            throw new NotFoundException();
        }
    }
}
