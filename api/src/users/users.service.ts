import { 
    Injectable,
    InternalServerErrorException
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '../database/prisma.service.js';

import { IFindUser } from './dto/find-user.dto.js';
import { IFindByCredentials } from './dto/findByCredentials-user.dto.js';
import { IUpdateUser } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService){}

    async create(data: Prisma.UserCreateInput): Promise<{new_user: User, message?: string}> {
        try {
            const new_user = await this.prisma.user.create({data});
            return {new_user, message: "Usuário criado com sucesso"};
        } catch(E: any) {
            throw new InternalServerErrorException("Não foi possível cadastrar usuário");
        }
    }

    async findFirst(data: IFindUser): Promise<User | null> {
        try {
            const user = await this.prisma.user.findFirst({where: data})
            return user;
        } catch(E: any) {
            throw new InternalServerErrorException("Erro inesperado ocorreu ao buscar usuário");
        }
    }

    async findByCredentials(data: IFindByCredentials): Promise<User | null> {
        try {
            const user = await this.prisma.user.findFirst({where: data})
            return user;
        } catch(E: any) {
            throw new InternalServerErrorException("Erro ao buscar usuário pelas suas credenciais");
        }
    }

    async update(id: string, data: IUpdateUser): Promise<void> {
        try {
            await this.prisma.user.update({
                where: {id},
                data
            })
        } catch(E: any) {
            throw new InternalServerErrorException("Erro inesperado ocorreu ao tentar atualizar usuário");
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.user.delete({where: { id }});
        }catch(E: any) {
            throw new InternalServerErrorException("Erro inesperado ocorreu ao tentar deletar usuário");
        }
    }
}
