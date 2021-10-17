/** Dependencies **/
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

/** Interfaces **/
import { TwitterOptions } from './twitter-options.interface';
import { TwitterOptionsFactory } from './twitter-async-factory.interface';

export interface TwitterAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<TwitterOptionsFactory>;
  useExisting?: Type<TwitterOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<TwitterOptions> | TwitterOptions;
}
