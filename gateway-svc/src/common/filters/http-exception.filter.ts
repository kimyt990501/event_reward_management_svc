import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const resBody = exception instanceof HttpException
      ? exception.getResponse()
      : {
          message: 'Internal server error',
          error: 'Internal Server Error',
        };

    const message = typeof resBody === 'string' ? resBody : resBody['message'];
    const error = typeof resBody === 'string' ? 'Error' : resBody['error'];

    response.status(status).json({
      code: 'FAIL',
      statusCode: status,
      message,
      error,
    });
  }
}