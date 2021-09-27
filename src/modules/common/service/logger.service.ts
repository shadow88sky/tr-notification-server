/**
 * Helper Logger service.
 * @file Helper Logger 模块服务
 *
 */
import winston from 'winston';
import { Injectable } from '@nestjs/common';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';
import { GetCallerModule } from 'caller-module';

const { format, transports } = winston;
const { combine, timestamp, label, printf } = format;

interface Error {
  name?: string;
  message?: string;
  stack?: string;
}

interface IOptions {
  module?: string;
  requestId?: string;
  [key: string]: any;
}

interface FormatOptions {
  message: string;
  level: string;
  label: string;
  timestamp: string;
  module?: string;
  requestId?: string;
  error?: Error;
}

// 格式化日志
const consoleFormatter = printf((options: FormatOptions) => {
  options.message =
    options.error && options.error.stack
      ? options.error.stack
      : options.message;
  // tslint:disable-next-line:max-line-length
  let msg = `[${options.label}-${options.level}]  ${options.timestamp} [file]:${options.module}  [msg]:${options.message}`;

  switch (options.level) {
    case 'error': {
      msg = `\u001b[31m${msg}\u001b[39m`;
      break;
    }
    case 'debug': {
      msg = `\u001b[34m${msg}\u001b[39m`;
      break;
    }
    case 'warn': {
      msg = `\u001b[33m${msg}\u001b[39m`;
      break;
    }
    default: {
      msg = `\u001b[32m${msg}\u001b[39m`;
      break;
    }
  }
  return msg;
});

const logFormatter = printf((options: FormatOptions) => {
  options.message =
    options.error && options.error.stack
      ? options.error.stack
      : options.message;
  const msg = `{"time":"${options.timestamp}","level":"${options.level}","server":"${options.label}",
     "file":"${options.module}","msg":"${options.message}"}`;
  return msg;
});

const debugTransportFile = new DailyRotateFile({
  filename: 'debug%DATE%.log',
  dirname: path.join(process.cwd(), '/logs'),
  level: 'debug',
  maxSize: 1024 * 1024 * 10, // 10MB
  datePattern: 'YYYYMMDD',
  zippedArchive: true,
  maxFiles: '14d',
  format: logFormatter,
});

const infoTransportFile = new DailyRotateFile({
  filename: 'info%DATE%.log',
  dirname: path.join(process.cwd(), '/logs'),
  level: 'info',
  maxSize: 1024 * 1024 * 10, // 10MB
  datePattern: 'YYYYMMDD',
  zippedArchive: true,
  maxFiles: '14d',
  format: logFormatter,
});

@Injectable()
export class LoggerService {
  private defaultLog: winston.Logger;

  constructor() {
    this.defaultLog = winston.createLogger({
      format: combine(
        label({ label: process.env.serverName || 'Log' }), // 服务名取环境变量，否则默认为Log
        timestamp(),
        logFormatter,
      ),
      transports: [
        new transports.Console({
          // 定义控制台输出的日志级别
          level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
          format: consoleFormatter,
        }),
        debugTransportFile,
        infoTransportFile,
      ],
      // 用来捕捉uncaughtException
      exceptionHandlers: [
        new transports.File({
          filename: 'exceptions.log',
          dirname: path.join(process.cwd(), '/logs'),
        }),
      ],
      // 在捕捉到一个uncaughtException不要退出进程
      exitOnError: false,
    });
  }

  info(message: string, options?: IOptions) {
    const meta = {
      module:
        (options && options.module) ||
        GetCallerModule(2).callSite.getFileName(),
      requestId: (options && options.requestId) || null,
    };
    this.defaultLog.info(message, { options, ...meta });
  }

  debug(message: string, options?: IOptions) {
    const meta = {
      module:
        (options && options.module) ||
        GetCallerModule(2).callSite.getFileName(),
      requestId: (options && options.requestId) || null,
    };
    this.defaultLog.debug(message, { options, ...meta });
  }
  warn(message: string, options?: IOptions) {
    const meta = {
      module:
        (options && options.module) ||
        GetCallerModule(2).callSite.getFileName(),
      requestId: (options && options.requestId) || null,
    };
    this.defaultLog.warn(message, { options, ...meta });
  }
  error(message: Error, options?: IOptions) {
    const meta = {
      module:
        (options && options.module) ||
        GetCallerModule(2).callSite.getFileName(),
      requestId: (options && options.requestId) || null,
    };
    this.defaultLog.error(JSON.stringify(message.message) + message.stack, {
      options,
      ...meta,
    });
  }
}
