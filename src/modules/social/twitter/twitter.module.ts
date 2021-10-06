import { DynamicModule, Module, Provider, ValueProvider } from '@nestjs/common';
import { TwitterOptionsFactory } from './twitter-async-factory.interface';
import { TwitterAsyncOptions } from './twitter-async-options.interface';
import { TwitterOptions } from './twitter-options.interface';
import { TWITTER_OPTIONS } from './twitter.constant';
import { TwitterService } from './twitter.service';

@Module({
  providers: [TwitterService],
})
export class TwitterModule {
  static forRoot(options?: TwitterOptions): DynamicModule {
    const TwitterOptionsProvider: ValueProvider<TwitterOptions> = {
      provide: TWITTER_OPTIONS,
      useValue: options,
    };
    return {
      module: TwitterModule,
      providers: [
        /** Options **/
        TwitterOptionsProvider,

        /** Services **/
        TwitterService,
      ],
      exports: [
        /** Services **/
        TwitterService,
      ],
    };
  }

  public static forRootAsync(options: TwitterAsyncOptions): DynamicModule {
    const providers: Provider[] = this.createAsyncProviders(options);

    return {
      module: TwitterModule,
      providers: [
        /** Providers **/
        ...providers,

        /** Services **/
        TwitterService,
      ],
      imports: options.imports,
      exports: [
        /** Services **/
        TwitterService,
      ],
    };
  }

  private static createAsyncProviders(
    options: TwitterAsyncOptions,
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
    options: TwitterAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        name: TWITTER_OPTIONS,
        provide: TWITTER_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      name: TWITTER_OPTIONS,
      provide: TWITTER_OPTIONS,
      useFactory: async (optionsFactory: TwitterOptionsFactory) => {
        return optionsFactory.createTwitterOptions();
      },
      inject: [options.useExisting! || options.useClass!],
    };
  }
}
