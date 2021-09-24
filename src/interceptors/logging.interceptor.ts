/**
 * Logging interceptor.
 * @file 日志拦截器
 * @module interceptor/logging
 */

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { ConfigService } from '../modules/config';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const call$ = next.handle();
    if (
      !this.configService.get('APP_ENV') ||
      this.configService.get('production') === 'production'
    ) {
      return call$;
    }
    const request = context.switchToHttp().getRequest();
    const content = request.method + ' -> ' + request.url;
    console.log('+++ 收到请求：', content);
    const now = Date.now();
    return call$.pipe(
      tap(() =>
        console.log('--- 响应请求：', content, `${Date.now() - now}ms`),
      ),
    );
  }
}
