import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientKnownRequestErrorFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { code, meta, message } = exception;
    if (code === 'P2002') {
      const fields = (meta.target as string[]).join(', ');
      response.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: `Fields: ${fields} are already registered and must be unique`,
      });
    }
    if (code === 'P2025') {
      response.status(404).json({
        message,
        error: 'Not Found',
        statusCode: 404,
      });
    }
  }
}
