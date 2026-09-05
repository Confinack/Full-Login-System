import { Injectable } from '@nestjs/common';
import { Prisma, User } from "@prisma/client";
import { PrismaService } from '../database/prisma.service.js';
import { IApiResponse } from "../types/apiResponse.js";
import { CreateUserDto, FindUserDto, UpdateUserDto } from "../dtos/UserDto.dto.js";

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService){}

    async signup(data: CreateUserDto): Promise<IApiResponse> {
        try {
            await this.prisma.user.create({ data });
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

    async signin({email, password}: FindUserDto): Promise<IApiResponse> {
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

    async update(id: string, data: UpdateUserDto): Promise<IApiResponse> {
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

    async delete(id: string): Promise<IApiResponse> {
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
