import httpStatus from 'http-status';
import { ApplicationError } from './application';

export class BadRequest extends ApplicationError {
  response = 'Bad request';
  code = httpStatus.BAD_REQUEST;
}
