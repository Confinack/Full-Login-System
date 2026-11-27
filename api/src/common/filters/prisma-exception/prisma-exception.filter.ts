import { 
  ArgumentsHost, 
  Catch, 
  ExceptionFilter,
  HttpStatus
} from '@nestjs/common';

import { Prisma } from "@prisma/client";
import { Response } from "express";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch(exception.code){
      case "P2000": {
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Violação de limites aceitos pela coluna"
        })
      };
      case "P2002": {
        return response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: "Violação de campo único"
        })
      };
      case "P2011": {
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Violação de campo não nulo"
        })
      };
      case "P2025": {
        return response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: "Registro não encontrado"
        })
      };
      default: {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Um erro interno aconteceu no banco de dados"
        })
      }
    }
  }
}
