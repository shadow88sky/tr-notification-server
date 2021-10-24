import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { RedisModule } from 'nestjs-redis';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from 'filters';
import { GraphQLModule } from '@nestjs/graphql';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './../auth';
import { CommonModule } from './../common';
import { SnapshotModule } from './../snapshot';
import { AddressModule } from './../address';
import { TransactionModule } from './../transaction';
import { MailModule } from './../mail';
import { SocialModule } from './../social';
import { SyncModule } from './../sync';
import { PluginModule } from './../plugin';
import { BalanceModule } from './../balance';
import { TreasuryModule } from './../treasury';
import { ScriptModule } from './../script';
import { NotificationModule } from './../notification';
import { ConfigModule, ConfigService } from './../config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  ErrorInterceptor,
  LoggingInterceptor,
  TransformInterceptor,
} from '../../interceptors';
import { AppResolver } from './app.resolver';
import { App } from './app.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          logging: configService.get('DB_LOGGING') === 'true',
          entities: [__dirname + './../**/**.entity{.ts,.js}'],
          synchronize: configService.get('DB_SYNC') === 'true',
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    ScheduleModule.forRoot(),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile:
          configService.get('GRAPHQL_SCHEMA_DEST') ||
          './src/graphql/schema.gql',
        debug: configService.get('GRAPHQL_DEBUG') === '1',
        playground: configService.get('PLAYGROUND_ENABLE') === '1',
        useGlobalPrefix: true,
        context: ({ req }: { req: Request }) => ({
          req,
        }),
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          host: configService.get('REDIS_HOST'),
          port: +configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWOR'),
        };
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          redis: {
            host: configService.get('REDIS_HOST'),
            port: +configService.get('REDIS_PORT'),
            password: configService.get('REDIS_PASSWOR'),
          },
        };
      },
    }),
    TypeOrmModule.forFeature([App]),
    ConfigModule,
    AuthModule,
    CommonModule,
    SnapshotModule,
    TransactionModule,
    SyncModule,
    AddressModule,
    MailModule,
    PluginModule,
    BalanceModule,
    TreasuryModule,
    SocialModule,
    ScriptModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
    AppResolver,
  ],
})
export class AppModule {}
