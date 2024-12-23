import pino from 'pino';
import { LoggerService } from '@nestjs/common';
import { v4 } from 'uuid';

const pinoLogger = pino({
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: true,
        },
      },
      {
        target: 'pino/file',
        options: { destination: 'logs/app.log', mkdir: true },
      },
    ],
  },
});

export class PinoLoggerAdapter implements LoggerService {
  private requestId: string;
  constructor(requestId?: string) {
    this.requestId = requestId || v4();
  }
  log(message: any, ...extra: any[]) {
    pinoLogger.info({ requestId: this.requestId, ...extra }, message);
  }
  verbose?(message: any, ...extra: any[]) {
    pinoLogger.trace({ requestId: this.requestId, ...extra }, message);
  }
  fatal?(message: any, ...extra: any[]) {
    pinoLogger.fatal({ requestId: this.requestId, ...extra }, message);
  }
  info(message: any, extra?: object) {
    pinoLogger.info({ requestId: this.requestId, ...extra }, message);
  }

  error(message: any, extra?: object) {
    pinoLogger.error({ requestId: this.requestId, ...extra }, message);
  }

  warn(message: any, extra?: object) {
    pinoLogger.warn({ requestId: this.requestId, ...extra }, message);
  }

  debug(message: any, extra?: object) {
    pinoLogger.debug({ requestId: this.requestId, ...extra }, message);
  }
  getRequestId() {
    this.requestId = v4();
    return this.requestId;
  }
}

export const Logger = new PinoLoggerAdapter();
