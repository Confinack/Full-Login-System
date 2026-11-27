import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from './app.module.js';
import { PrismaExceptionFilter } from "./common/filters/prisma-exception/prisma-exception.filter.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  const swagger_config = new DocumentBuilder()
    .setTitle("Full login system API")
    .setDescription("Essa é uma api de autenticação completa desde validação de email via código OTP, redefinição de senha, geração de tokens JWT e utilização de OAuth2")
    .setVersion("1.0")
    .addTag("Auth", "Rotas de autenticação (registro [já inclui o uso do código OTP], login, redefinição de senha)")
    .build();

  const document = SwaggerModule.createDocument(app, swagger_config);
  SwaggerModule.setup("docs", app, document);

  app.useGlobalFilters(new PrismaExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
