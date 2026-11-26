import { 
    Injectable,
    InternalServerErrorException
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '../database/prisma.service.js';

import { IUserResponse } from './dto/users-response.dto.js';
import { IFindUser } from './dto/find-users.dto.js';
import { IFindByCredentials } from './dto/find-by-credentials.dto.js';
import { IUpdateUser } from './dto/update-users.dto.js';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService){};

    async create(data: Prisma.UserCreateInput): Promise<{ user: IUserResponse, message?: string}> {
        try {
            const user = await this.prismaService.user.create({
                data,
                omit: {
                    password: true
                }
            });
            return {user, message: "Usuário criado com sucesso"};
        } catch(E: any) {
            throw new InternalServerErrorException("Não foi possível cadastrar usuário");
        }
    }

    async findFirst(data: IFindUser): Promise< IUserResponse | null> {
        try {
            const user = await this.prismaService.user.findFirst({
                where: data,
                omit: {
                    password: true
                }
            });
            return user;
        } catch(E: any) {
            throw new InternalServerErrorException("Erro inesperado ocorreu ao buscar usuário");
        }
    }

    async findByCredentials(data: IFindByCredentials): Promise< IUserResponse | null> {
        try {
            const user = await this.prismaService.user.findFirst({
                where: data,
                omit: {
                    password: true
                }
            });
            return user;
        } catch(E: any) {
            throw new InternalServerErrorException("Erro ao buscar usuário pelas suas credenciais");
        }
    }

    async update(id: string, data: IUpdateUser): Promise<void> {
        try {
            await this.prismaService.user.update({
                where: {id},
                data
            });
        } catch(E: any) {
            throw new InternalServerErrorException("Erro inesperado ocorreu ao tentar atualizar usuário");
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prismaService.user.delete({where: { id }});
        }catch(E: any) {
            throw new InternalServerErrorException("Erro inesperado ocorreu ao tentar deletar usuário");
        }
    }
}
