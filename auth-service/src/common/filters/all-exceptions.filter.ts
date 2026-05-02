import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();
      
      message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse.message || exception.message);

      if (Array.isArray(message)) {
        message = message.join(', ');
      }
      
      code = exceptionResponse.error ? exceptionResponse.error.toUpperCase().replace(/\s+/g, '_') : 'HTTP_ERROR';
    }

    response.status(status).json({
      success: false,
      message: message,
      data: null,
      error: {
        code,
        details: message,
      },
    });
  }
}
