import { DynamicModule, Module } from '@nestjs/common';
import _ from 'lodash';
import { PluginService } from './plugin.service';
import { BalanceModule } from './../balance';
import { SocialModule } from './../social';
import { NotificationModule } from './../notification';
import { createStrategyProviders } from './plugin.provider';

const strategyProviders = createStrategyProviders();

@Module({
  imports: [BalanceModule, NotificationModule, SocialModule],
  providers: [PluginService, ...strategyProviders],
})
export class PluginModule {}

/*
export class PluginModule {
  static async forRoot(_entities = [], _options?): Promise<DynamicModule> {
    const loadedPlugins: Array<Promise<DynamicModule>> = new Array();
    this.searchPluginsInFolder(PLUGIN_PATH).forEach((filePath) => {
      loadedPlugins.push(
        this.loadPlugin(filePath).then((module) => {
          return module['Strategy'];
        }),
      );
    });

    return Promise.all(loadedPlugins).then((allPlugins: DynamicModule[]) => {
      // 
      const pugins = [...allPlugins];
      
      // pugins.push([BalanceModule])

      return {
        module: PluginModule,
        imports: [...pugins],
      };
    });
  }

  private static loadPlugin(pluginPath: string): Promise<DynamicModule> {
    const modulePlugin = import(pluginPath);

    return modulePlugin;
  }

  private static searchPluginsInFolder(folder: string): string[] {
    return this.recFindByExt(folder, 'ts');
  }

  private static recFindByExt(
    base: string,
    ext: string,
    files?: string[],
    result?: string[],
  ): any[] {
    files = files || fs.readdirSync(base);
    result = result || [];

    files.forEach((file) => {
      const newbase = path.join(base, file);
      if (fs.statSync(newbase).isDirectory()) {
        result = this.recFindByExt(
          newbase,
          ext,
          fs.readdirSync(newbase),
          result,
        );
      } else {
        if (file.substr(-1 * (ext.length + 1)) === '.' + ext) {
          if (result) {
            result.push(newbase);
          }
        }
      }
    });
    return result;
  }
}

*/
