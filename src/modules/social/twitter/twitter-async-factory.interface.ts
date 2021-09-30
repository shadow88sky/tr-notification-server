/** Interfaces **/
import { TwitterOptions } from './twitter-options.interface';

export interface TwitterOptionsFactory {
  createTwitterOptions(): Promise<TwitterOptions> | TwitterOptions;
}
