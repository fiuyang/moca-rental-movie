import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EntityNotFoundError } from 'typeorm';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const traceId = request.headers['x-request-id'] || uuidv4();

    const { status, message: errorResponse } =
      this.getHttpStatusAndMessage(exception);
    const responsePayload = {
      statusCode: status,
      error: true,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof errorResponse === 'object'
          ? errorResponse['message'] || errorResponse
          : errorResponse,
      trace_id: traceId,
      stack: exception.stack,
    };

    this.logger.error(
      `
      ${request.method} ${request.url}`,
      JSON.stringify(responsePayload),
      `AllExceptionFilter`,
    );

    response.status(status).json(responsePayload);
  }

  getHttpStatusAndMessage(exception: any) {
    if (exception instanceof HttpException) {
      return {
        status: exception.getStatus(),
        message: exception.getResponse(),
      };
    } else if (exception instanceof EntityNotFoundError) {
      return { status: HttpStatus.BAD_REQUEST, message: exception.message };
    } else {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }
  }
}
