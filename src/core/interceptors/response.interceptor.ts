import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Logger } from '../utils/logger';
import { v4 } from 'uuid';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const requestId = Logger.getRequestId();

    request.headers['x-request-id'] = requestId;

    Logger.info('Incoming Request', {
      event: 'request',
      requestId,
      method: request.method,
      url: request.url,
      body: request.body,
    });

    const meta = {
      requestId,
      timestamp: new Date().toISOString(),
    };

    return next.handle().pipe(
      map((data) => {
        Logger.info('Outgoing Response', {
          requestId,
          event: 'response',
          statusCode: response.statusCode,
          data: data,
        });
        return {
          success: true,
          data,
          meta
        };
      }),
      catchError((err) => {
        const res =
          typeof err.getResponse === 'function' ? err.getResponse() : {};

        const statusCode =
          err?.status || err?.statusCode || res.statusCode || 400;

        const errors = res?.message ? Array.isArray(res?.message) ? res.message : [res?.message] : [err.message];

        Logger[statusCode < 500 ? 'error' : 'fatal']('Error Response', {
          requestId,
          event: 'validation-error',
          errors,
          statusCode: err?.status || err?.statusCode || res.statusCode || 400,
        });

        const customErrorBody = {
          success: false,
          errors,
          meta
        };

        if (statusCode < 500) {
          throw new HttpException(customErrorBody, statusCode);
        }
        throw new HttpException(customErrorBody, 500);
      }),
    )
  }
}
