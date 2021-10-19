/**
 * Transform interceptor.
 * @file 请求流拦截器
 * @module interceptor/transform
 */

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { THttpSuccessResponse, EHttpStatus } from '../interfaces';

/**
 * @class TransformInterceptor
 * @classdesc 当控制器所需的 Promise service 成功响应时，将在此被转换为标准的数据结构 IHttpResultPaginate
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, THttpSuccessResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<THttpSuccessResponse<T>> {
    const graphqlContext = GqlExecutionContext.create(_context);

    // const request = graphqlContext.switchToHttp().getRequest();
    if (graphqlContext.getType() === 'graphql') {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        statusCode: '200',
        status: EHttpStatus.Success,
        message: '',
        result: data,
      })),
    );
  }
}
