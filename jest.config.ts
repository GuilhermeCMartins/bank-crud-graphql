import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@views/(.*)$': '<rootDir>/src/application/adapters/http/views/$1',
    '^@adapters/(.*)$': '<rootDir>/src/application/adapters/$1',
    '^@controllers$': '<rootDir>/src/application/adapters/http/controllers',
    '^@controller/(.*)$':
      '<rootDir>/src/application/adapters/http/controllers/$1',
    '^@middlewares$': '<rootDir>/src/application/adapters/http/middlewares',
    '^@entity/(.*)$': '<rootDir>/src/application/entities/$1',
  },
};

export default config;
