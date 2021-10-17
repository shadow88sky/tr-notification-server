import { Provider } from '@nestjs/common';
import path from 'path';
import fs from 'fs';

export const PLUGIN_PATH = path.normalize(
  path.join(__dirname, '../../strategy/'),
);

export function createStrategyProviders(): any {
  const loadedPlugins: Array<Provider> = new Array();

  searchPluginsInFolder(PLUGIN_PATH).forEach((filePath) => {
    const plugin = loadPlugin(filePath);
    loadedPlugins.push(plugin);
  });

  return loadedPlugins;
}

function loadPlugin(pluginPath: string): Provider {
  const modulePlugin = require(pluginPath);
  return modulePlugin['Strategy'];
}

function searchPluginsInFolder(folder: string): string[] {
  return recFindByExt(folder, process.env.fileExt || 'ts');
}

function recFindByExt(
  base: string,
  ext: string,
  files?: string[],
  result?: string[],
): any[] {
  files = files || fs.readdirSync(base);
  result = result || [];

  files.forEach((file) => {
    const newbase = path.join(base, file);
    if (file.substr(-1 * (ext.length + 1)) === '.' + ext) {
      if (result) {
        result.push(newbase);
      }
    }
  });
  return result;
}
