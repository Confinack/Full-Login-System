import { 
    Injectable,
    InternalServerErrorException
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '../database/prisma.service.js';

import { IUserResponse } from './dto/users-response.dto.js';
import { IFindUser } from './dto/find-users.dto.js';
import { IUpdateUser } from './dto/update-users.dto.js';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService){};

    async create(data: Prisma.UserCreateInput): Promise<{ user: IUserResponse, message?: string}> {
        const user = await this.prismaService.user.create({
            data,
            omit: {
                password: true
            }
        });
        return {user, message: "Usuário criado com sucesso"};
    }

    async findFirst(data: IFindUser): Promise< IUserResponse | null> {
        const user = await this.prismaService.user.findFirst({
            where: data,
            omit: {
                password: true
            }
        });

        return user;
    }

    async findByEmailWithPassword(email: string): Promise< User | null> {
        const user = await this.prismaService.user.findUnique({ where: { email } });
        return user;
    }

    async update(id: string, data: IUpdateUser): Promise<void> {
        await this.prismaService.user.update({
            where: {id},
            data
        });
    }

    async delete(id: string): Promise<void> {        
        await this.prismaService.user.delete({where: { id }});
    }
}
