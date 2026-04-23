import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : (res as any).message ?? exception.message;
    } else if (this.isFirebaseError(exception)) {
      const mapped = this.mapFirebaseError(exception as any);
      status = mapped.status;
      message = mapped.message;
      code = (exception as any).code;
    }

    this.logger.error(
      `${request.method} ${request.url} → ${status}: ${message}`,
    );

    response.status(status).json({
      statusCode: status,
      message,
      ...(code && { code }),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private isFirebaseError(exception: unknown): boolean {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      typeof (exception as any).code === 'string' &&
      (exception as any).code.startsWith('auth/')
    );
  }

  private mapFirebaseError(error: { code: string }): {
    status: number;
    message: string;
  } {
    const map: Record<string, { status: number; message: string }> = {
      'auth/user-not-found': {
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      },
      'auth/email-already-exists': {
        status: HttpStatus.CONFLICT,
        message: 'Email already in use',
      },
      'auth/invalid-email': {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid email address',
      },
      'auth/weak-password': {
        status: HttpStatus.BAD_REQUEST,
        message: 'Password is too weak',
      },
      'auth/id-token-expired': {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Token expired',
      },
      'auth/argument-error': {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid argument',
      },
    };

    return (
      map[error.code] ?? {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Authentication error',
      }
    );
  }
}
