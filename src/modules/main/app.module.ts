import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from 'filters';
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
import { CategoryModule } from './../category';
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
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('configService', configService);
        return {
          closeClient: true,
          config: {
            host: configService.get('REDIS_HOST'),
            port: +configService.get('REDIS_PORT'),
            password: configService.get('REDIS_PASSWOR'),
          },
        } as RedisModuleOptions;
      },
    }),
    ScheduleModule.forRoot(),
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
    CategoryModule,
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
  ],
})
export class AppModule {}
