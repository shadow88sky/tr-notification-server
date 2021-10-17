/** Interfaces **/
import { TelegramOptions } from './telegram-options.interface';

export interface TelegramOptionsFactory {
  createTelegramOptions(): Promise<TelegramOptions> | TelegramOptions;
}
