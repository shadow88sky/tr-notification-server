import { DynamicModule, Module } from '@nestjs/common';
import { TelegramAsyncOptions } from './telegram-async-options.interface';
import { TelegramCoreModule } from './telegram-core.module';
import { TelegramOptions } from './telegram-options.interface';

@Module({})
export class TelegramModule {
  static forRoot(options?: TelegramOptions): DynamicModule {
    return {
      module: TelegramModule,
      imports: [
        /** Modules **/
        TelegramCoreModule.forRoot(options!),
      ],
    };
  }

  public static forRootAsync(options: TelegramAsyncOptions): DynamicModule {
    return {
      module: TelegramModule,
      imports: [
        /** Modules **/
        TelegramCoreModule.forRootAsync(options),
      ],
    };
  }
}
