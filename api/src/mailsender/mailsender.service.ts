import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailsenderService {
    private readonly transporter: nodemailer.Transporter;

    constructor(){
        this.transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "e04c2f16a777b8",
                pass: "85d32bdd50bacb"
            }
        })
    }

    async sendEmail({ to, subject, text }: { to: string, subject: string, text: string }): Promise<void>{
        await this.transporter.sendMail({
            from: "nao-responda@gmail.com",
            to,
            subject,
            text
        })
        return;
    }
}
