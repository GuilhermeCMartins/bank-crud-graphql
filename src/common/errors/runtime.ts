import { ApplicationError } from './application';

export class RuntimeError extends ApplicationError {
  static is(error: unknown): error is typeof this {
    return error instanceof RuntimeError;
  }
}
