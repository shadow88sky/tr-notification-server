/** Dependencies **/
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

/** Interfaces **/
import { TelegramOptions } from './telegram-options.interface';
import { TelegramOptionsFactory } from './telegram-async-factory.interface';

export interface TelegramAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<TelegramOptionsFactory>;
  useExisting?: Type<TelegramOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<TelegramOptions> | TelegramOptions;
}
