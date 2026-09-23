import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { OtpService } from '../otp/otp.service.js';
import { UserHandlersResponse } from "../dtos/API.dto.js";
import { CreateUserDto, FindUserDto, UpdateUserDto } from "../dtos/User.dto.js";

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService, private readonly OTPService: OtpService){}

    async signup(data: CreateUserDto): Promise<UserHandlersResponse> {
        try {
            await this.prisma.user.create({ data });
            await this.OTPService.sendOTP(data.email);
            
            return { status: 201, message: "User created"}
        }catch(E: any) {
            const driverError = (E.meta as any)?.driverAdapterError;
            const message = (driverError as any)?.cause?.originalMessage || "Unknow";

            return {
                status: 409,
                message
            }
        }
    }

    async signin({email, password}: FindUserDto): Promise<UserHandlersResponse> {
        try {
            const user = await this.prisma.user.findFirst({
                where: {email, password}
            })

            if (!user) return { status: 404, message: "User not found"};

            return {
                status: 200,
                body: user
            }
        }catch(E: any) {
            const driverError = (E.meta as any)?.driverAdapterError;
            const message = (driverError as any)?.cause?.originalMessage || "Unknow";

            return {
                status: 404,
                message
            }
        }
    }

    async update(id: string, data: UpdateUserDto): Promise<UserHandlersResponse> {
         try {
            const user = await this.prisma.user.update({
                where: { id },
                data
            })

            return { status: 200 }
        }catch(E: any) {
            const driverError = (E.meta as any)?.driverAdapterError;
            const message = (driverError as any)?.cause?.originalMessage || "Unknow";

            return {
                status: 404,
                message
            }
        }
    }

    async delete(id: string): Promise<UserHandlersResponse> {
        try {
            await this.prisma.user.delete({
                where: { id } 
            })

            return { status: 204 }
        }catch(E: any) {
            const driverError = (E.meta as any)?.driverAdapterError;
            const message = (driverError as any)?.cause?.originalMessage || "Unknow";

            return {
                status: 404,
                message
            }
        }
    }
}
