import httpStatus from 'http-status';
import { ApplicationError } from './application';

export class NotFound extends ApplicationError {
  response = 'Not found';
  code = httpStatus.NOT_FOUND;
}
