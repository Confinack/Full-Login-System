import { Injectable } from '@nestjs/common';
import { MailsenderService } from "../mailsender/mailsender.service.js";
import { PrismaService } from '../database/prisma.service.js';
import * as crypto from "crypto";

@Injectable()
export class OtpService {
    // 30 minutos;
    private readonly otp_expiry_time = (30 * 60 * 1000);
    
    constructor(private readonly MailService: MailsenderService, private readonly PrismaService: PrismaService){};

    // Eu sei que é uma linha só, mas por acaso se eu quiser adicionar complexidade nessa lógica eu já tenho a função pronta
    private generateOTP(): number {return crypto.randomInt(100000, 999999)}

    async sendOTP(email: string): Promise<string | void> {
        try {

            const user = await this.PrismaService.user.findFirst({
                where: {email}
            })
            if (!user) {return "Email not found"}

            const code = this.generateOTP();
            const current_date = new Date();
            current_date.setTime(current_date.getTime() + this.otp_expiry_time);

            await this.PrismaService.user.update({
                where: { email },
                data: {
                    ...user, 
                    OTP_CODE: code,
                    OTP_EXPIRY: current_date
                }
            })

            await this.MailService.sendEmail({
                to: email,
                subject: "OTP verification",
                text: `Your OTP code is ${code}`
            });

            return;
        } catch(E: any) {
            console.log(E.message);
            return;
        }
    }
}
