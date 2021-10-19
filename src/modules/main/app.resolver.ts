import { UseFilters } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { GqlResolverExceptionsFilter } from '../../filters/gql-resolver-exceptions.filter';
import { App } from './app.entity';
import { AppService } from './app.service';

@Resolver('App')
@UseFilters(GqlResolverExceptionsFilter)
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => App)
  async app(): Promise<App | null> {
    return await this.appService.findOne({});
  }

  @Query(() => [App])
  async apps(): Promise<App[]> {
    return await this.appService.find({});
  }
}
