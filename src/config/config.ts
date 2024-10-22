import path from 'node:path';
import { Environment } from './env';
import type { ITenantConfig } from './tenants';
import yaml from 'js-yaml';
import { fork } from '@common/loggers';
import { ConfigurationError } from '@common/errors';

export interface ISecretsConfig {
  access_id: string;
  secret_key: string;
  region: string;
}

export interface IServerConfig {
  port: number;
}

export interface IConfig {
  secrets: ISecretsConfig;
  server: IServerConfig;
  tenants: Record<string, ITenantConfig>;
}

const logger = fork('config');

const entry = path.dirname(process.mainModule?.filename || '');
const searchPaths = [
  '.',
  path.resolve(__dirname, 'config'),
  path.resolve(entry, 'config'),
  path.resolve(entry, '..', 'config'),
  path.resolve(entry, '../..', 'config'),
];

let config: IConfig | null = null;

export const loadConfig = (): IConfig => {
  if (config) {
    return config;
  }

  for (const configPath of searchPaths) {
    try {
      const filePath = `${configPath}/config.${Environment}.yaml`;
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        config = yaml.load(fileContent) as IConfig;
        logger.info(`Using configuration file: ${filePath}`);
        return config;
      }
    } catch (error) {
      logger.warn(`Failed to load config from path: ${configPath}`);
    }
  }

  throw new ConfigurationError(
    `Configuration file not found for ${Environment} environment in any of the paths: ${searchPaths.join(', ')}`
  );
};

export const getConfig = (): IConfig => {
  if (!config) {
    throw new ConfigurationError(
      'Configuration has not been loaded yet. Call loadConfig() first.'
    );
  }
  return config;
};

loadConfig();
