import { ApplicationError } from './application';

export class ConfigurationError extends ApplicationError {
  static is(error: unknown): error is typeof this {
    return error instanceof ConfigurationError;
  }
}
