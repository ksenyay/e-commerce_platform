import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'INTERNAL_ERROR';
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse() as HttpException;
      message = res?.message;
      error = HttpStatus[statusCode];
    } else if (exception instanceof Error) {
      message = exception.message;
      error = 'INTERNAL_ERROR';
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(statusCode).json({
      statusCode,
      error,
      message,
    });
  }
}
