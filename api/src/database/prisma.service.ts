import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(){
        const adapter = new PrismaMariaDb({
            host: "localhost",
            user: "root",
            password: "",
            database: "full_login",
            port: 3306,
        })

        super({adapter})
    }
    async onModuleInit() {
        await this.$connect(); 
    }
}
