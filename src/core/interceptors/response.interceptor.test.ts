import { ResponseInterceptor } from './response.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { Logger } from '../utils/logger';
import { HttpException } from '@nestjs/common';

jest.mock('../utils/logger');

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;
  let context: ExecutionContext;
  let callHandler: CallHandler;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          url: '/test',
          body: {},
          headers: {},
        }),
        getResponse: jest.fn().mockReturnValue({
          statusCode: 200,
        }),
      }),
    } as unknown as ExecutionContext;
    callHandler = {
      handle: jest.fn().mockReturnValue(of({ data: 'test' })),
    };
    Logger.fatal = jest.fn();
    Logger.getRequestId = jest.fn().mockReturnValue('test-request-id');
  });

  it('should add requestId to request headers and log incoming request', () => {
    interceptor.intercept(context, callHandler).subscribe();

    const request = context.switchToHttp().getRequest();
    expect(request.headers['x-request-id']).toBe('test-request-id');
    expect(Logger.info).toHaveBeenCalledWith('Incoming Request', {
      event: 'request',
      requestId: 'test-request-id',
      method: 'GET',
      url: '/test',
      body: {},
    });
  });

  it('should log outgoing response and return success response', (done) => {
    interceptor.intercept(context, callHandler).subscribe((result) => {
      expect(Logger.info).toHaveBeenCalledWith('Outgoing Response', {
        requestId: 'test-request-id',
        event: 'response',
        statusCode: 200,
        data: { data: 'test' },
      });
      expect(result).toEqual({
        success: true,
        data: { data: 'test' },
        meta: {
          requestId: 'test-request-id',
          timestamp: expect.any(String),
        },
      });
      done();
    });
  });

  it('should handle errors and log error response', (done) => {
    const error = new HttpException('Test Error', 400);
    callHandler.handle = jest.fn().mockReturnValue(throwError(error));

    interceptor.intercept(context, callHandler).subscribe({
      error: (err) => {
        expect(Logger.error).toHaveBeenCalledWith('Error Response', {
          event: 'validation-error',
          requestId: 'test-request-id',
          errors: ['Test Error'],
          statusCode: 400,
        });
        expect(err.getResponse()).toEqual({
          success: false,
          errors: ['Test Error'],
          meta: {
            requestId: 'test-request-id',
            timestamp: expect.any(String),
          },
        });
        done();
      },
    });
  });
});
