// This exception filter should be used for every resolver
// e.g:
// @UseFilters(GqlResolverExceptionsFilter)
// export class GqlResolver {}

import { Catch, ArgumentsHost, Inject, HttpException } from '@nestjs/common';

import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';

import { ApolloError } from 'apollo-server-express';
import { Request } from 'express';

import { LoggerService } from '../modules/common';

export type RequestData = {
  query: string;
  hostname: string;
  ip: string;
  userId: string;
};

export const PRISMA_CODE_UNIQUE_KEY_VIOLATION = 'P2002';

export class UniqueKeyException extends ApolloError {
  constructor(fields: string[]) {
    super(
      `Another record with the same key already exist (${fields.join(', ')})`,
    );
  }
}

export class InternalServerError extends ApolloError {
  constructor() {
    super('Internal server error');
  }
}

// export function createRequestData(req: Request): RequestData {}

@Catch()
export class GqlResolverExceptionsFilter implements GqlExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: Error, host: ArgumentsHost): Error {
    this.loggerService.error(exception);

    let clientError: Error = exception;
    console.log('exception', exception);
    return clientError;
  }

  // prepareRequestData(host: ArgumentsHost): RequestData | null {
  //   const { req } = GqlArgumentsHost.create(host).getContext();
  //   return req ? createRequestData(req) : null;
  // }
}
