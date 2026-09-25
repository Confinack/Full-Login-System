import { 
    Injectable,
    NotFoundException,
    ConflictException,
    InternalServerErrorException,
    BadRequestException
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { OtpService } from '../otp/otp.service.js';
import { UserHandlersResponse } from "../dtos/API.dto.js";
import { CreateUserDto, FindUserDto, UpdateUserDto } from "../dtos/User.dto.js";
import { IFindUser } from './dto/find-user.dto.js';
import { IUpdateUser } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService, private readonly OTPService: OtpService){}

    async create(data: Prisma.UserCreateInput): Promise<{new_user: User, message?: string,}> {
        try {
            const new_user = await this.prisma.user.create({data});
            return {new_user, message: "Usuário criado com sucesso"};
        } catch(E: any) {
            throw new ConflictException();
        }
    }

    async findFirst(data: IFindUser): Promise<User> {
        try {
            const user = await this.prisma.user.findFirst({where: data})
            if (!user) {throw new NotFoundException()}
            return user;
        } catch(E: any) {
            throw new InternalServerErrorException();
        }
    }

    async findByEmail(email: string): Promise<User> {
        try {
            const user = await this.prisma.user.findFirst({where: {email}});
            if (!user) {throw new NotFoundException()}

            return user;
        } catch (E: any) {
            throw new BadRequestException();
        }
    }

    async update(id: string, data: IUpdateUser): Promise<void> {
        try {
            const user = await this.prisma.user.update({
                where: {id},
                data
            })
        } catch(E: any) {
            throw new ConflictException();
        }
    }

    async updatea(id: string, data: UpdateUserDto): Promise<UserHandlersResponse> {
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
