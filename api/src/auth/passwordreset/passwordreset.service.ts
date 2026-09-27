import { 
    Injectable, 
    HttpException, 
    InternalServerErrorException, 
    NotFoundException,
    RequestTimeoutException
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { MailsenderService } from '../../mailsender/mailsender.service.js';
import { IPasswordResetRequest } from '../dto/password-reset-request.dto.js';

import * as crypto from "crypto";
import { IResetPassword } from '../dto/verify-password-reset-token.dto.js';

@Injectable()
export class PasswordresetService {
    private readonly token_expiry_time_in_minutes = 10;
    constructor(private readonly MailSender: MailsenderService, private readonly PrismaSerivce: PrismaService){};

    async generatePasswordResetToken({user_id, to}: IPasswordResetRequest): Promise<void> {
        try {
            await this.PrismaSerivce.passwordReset.deleteMany({where: {user_id}});

            const token = crypto.randomUUID();
            const expiryAt = new Date();
            expiryAt.setTime(expiryAt.getTime() + (this.token_expiry_time_in_minutes * 60 * 1000));

            await this.PrismaSerivce.passwordReset.create({
                data: {
                    token,
                    user_id,
                    expiryAt
                }
            });

            await this.MailSender.sendEmail({
                to,
                subject: "Recuperar senha",
                text: "Para recuperar sua senha acesse: <...>"
            });

        } catch(E: any){
            if(E instanceof HttpException){
                throw E;
            };

            throw new InternalServerErrorException("Erro ao gerar token parar resetar senha");
        }
    }

    async verifyToken(token: string): Promise<{user_id?: string, isTokenValid: boolean}> {
        try {
            const ocurrence = await this.PrismaSerivce.passwordReset.findFirst({where: {token}});
            const current_date = new Date();

            if(!ocurrence){throw new NotFoundException("Não foi possível localizar o token")};
            if(current_date > ocurrence.expiryAt){throw new RequestTimeoutException("Token expirado")};

            return {user_id: ocurrence.user_id, isTokenValid: true};
        } catch(E: any) {
            if(E instanceof HttpException){
                throw E;
            };

            throw new InternalServerErrorException("Erro ao tentar verificar token para resetar senha");
        }
    }
}
