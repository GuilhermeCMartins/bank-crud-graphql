export enum AvailableEnvs {
  Debug = 'debug',
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

export const Environment = process.env.NODE_ENV ?? AvailableEnvs.Development;
export const LogLevels = {
  [AvailableEnvs.Debug]: 'debug',
  [AvailableEnvs.Development]: 'info',
  [AvailableEnvs.Staging]: 'info',
  [AvailableEnvs.Production]: 'info',
};

export const CurrentLogLevel = LogLevels[Environment as AvailableEnvs];
