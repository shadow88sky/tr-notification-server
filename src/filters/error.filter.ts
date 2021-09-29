/**
 * HttpException filter.
 * @file 全局异常拦截器
 * @module filter/error
 */

import lodash from 'lodash';
import { EHttpStatus, TExceptionOption, TMessage } from '../interfaces';
import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from '../modules/common';
import {
  CannotCreateEntityIdMapError,
  EntityNotFoundError,
  QueryFailedError,
} from 'typeorm';
import { CustomError } from '../errors/custom.error';
/**
 * @class HttpExceptionFilter
 * @classdesc 拦截全局抛出的所有异常，同时任何错误将在这里被规范化输出 THttpErrorResponse
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    this.loggerService.error(exception);

    const request = host.switchToHttp().getRequest();
    const response = host.switchToHttp().getResponse();

    let message = (exception as any).message.message;
    //let code = 'HttpException';

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (exception.constructor) {
      case HttpException:
        statusCode = (exception as HttpException).getStatus();
        break;
      case QueryFailedError: // this is a TypeOrm error
        statusCode = (exception as any).code;
        message = (exception as unknown as QueryFailedError).message;
        break;
      case EntityNotFoundError: // this is another TypeOrm error
        statusCode = (exception as any).code;
        message = (exception as unknown as EntityNotFoundError).message;
        break;
      case CannotCreateEntityIdMapError: // and another
        statusCode = (exception as any).code;
        message = (exception as CannotCreateEntityIdMapError).message;
        break;
      case CustomError:
        const errorOption: TExceptionOption = response
          ? (exception.getResponse() as TExceptionOption)
          : exception.message;
        const isString = (value): value is TMessage => lodash.isString(value);
        message = isString(errorOption) ? errorOption : errorOption.message;

        statusCode = isString(errorOption)
          ? statusCode
          : errorOption.statusCode;

        break;
      default:
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    /*
    const status = exception.getStatus() ===
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorOption: TExceptionOption = exception.getResponse()
      ? (exception.getResponse() as TExceptionOption)
      : exception.message;
    const isString = (value): value is TMessage => lodash.isString(value);
    const errMessage = isString(errorOption)
      ? errorOption
      : errorOption.message;

    const errorInfo = isString(errorOption) ? null : errorOption.error;
    const parentErrorInfo = errorInfo ? String(errorInfo) : null;
    const isChildrenError = errorInfo?.status && errorInfo?.message;
    const resultError =
      (isChildrenError && errorInfo.message) || parentErrorInfo;
    const resultStatus = isChildrenError ? errorInfo.status : status;

    */
    const data = {
      statusCode: `${statusCode}`,
      status: EHttpStatus.Error,
      message: message,
      error: exception.stack,
    };

    // new CustomError();
    // 对默认的 404 进行特殊处理
    if (statusCode === HttpStatus.NOT_FOUND) {
      data.error = `资源不存在`;
      data.message = `接口 ${request.method} -> ${request.url} 无效`;
    }
    // return response.status(statusCode).jsonp(data);
    return response.status(200).jsonp(data);
  }
}
