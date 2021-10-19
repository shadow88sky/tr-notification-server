import { DynamicModule, Global, Module, Provider, ValueProvider } from '@nestjs/common';
import { TelegramOptionsFactory } from './telegram-async-factory.interface';
import { TelegramAsyncOptions } from './telegram-async-options.interface';
import { TelegramOptions } from './telegram-options.interface';
import { TELEGRAM_OPTIONS } from './telegram.constant';
import { TelegramService } from './telegram.service';

@Global()
@Module({})
export class TelegramCoreModule {
  static forRoot(options?: TelegramOptions): DynamicModule {
    const TelegramOptionsProvider: ValueProvider<TelegramOptions> = {
      provide: TELEGRAM_OPTIONS,
      useValue: options,
    };
    return {
      module: TelegramCoreModule,
      providers: [
        /** Options **/
        TelegramOptionsProvider,

        /** Services **/
        TelegramService,
      ],
      exports: [
        /** Services **/
        TelegramService,
      ],
    };
  }

  public static forRootAsync(options: TelegramAsyncOptions): DynamicModule {
    const providers: Provider[] = this.createAsyncProviders(options);

    return {
      module: TelegramCoreModule,
      providers: [
        /** Providers **/
        ...providers,

        /** Services **/
        TelegramService,
      ],
      imports: options.imports,
      exports: [
        /** Services **/
        TelegramService,
      ],
    };
  }

  private static createAsyncProviders(
    options: TelegramAsyncOptions,
  ): Provider[] {
    const providers: Provider[] = [this.createAsyncOptionsProvider(options)];

    if (options.useClass) {
      providers.push({
        provide: options.useClass,
        useClass: options.useClass,
      });
    }

    return providers;
  }

  private static createAsyncOptionsProvider(
    options: TelegramAsyncOptions,
  ): Provider {

    if (options.useFactory) {
      return {
        name: TELEGRAM_OPTIONS,
        provide: TELEGRAM_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      name: TELEGRAM_OPTIONS,
      provide: TELEGRAM_OPTIONS,
      useFactory: async (optionsFactory: TelegramOptionsFactory) => {
        return optionsFactory.createTelegramOptions();
      },
      inject: [options.useExisting! || options.useClass!],
    };
  }
}
