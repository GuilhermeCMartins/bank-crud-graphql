import httpStatus from 'http-status';
import { ApplicationError } from './application';

export class UnsupportedTenant extends ApplicationError {
  response = 'Unsupported tenant';
  code = httpStatus.UNPROCESSABLE_ENTITY;
}
