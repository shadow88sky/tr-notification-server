import { DynamicModule, Module } from '@nestjs/common';
import { TwitterAsyncOptions } from './twitter-async-options.interface';
import { TwitterCoreModule } from './twitter-core.module';
import { TwitterOptions } from './twitter-options.interface';
import { TwitterService } from './twitter.service';

@Module({})
export class TwitterModule {
  static forRoot(options?: TwitterOptions): DynamicModule {
    return {
      module: TwitterModule,
      imports: [
        /** Modules **/
        TwitterCoreModule.forRoot(options!),
      ],
    };
  }

  public static forRootAsync(options: TwitterAsyncOptions): DynamicModule {
    return {
      module: TwitterModule,
      imports: [
        /** Modules **/
        TwitterCoreModule.forRootAsync(options),
      ],
    };
  }
}
