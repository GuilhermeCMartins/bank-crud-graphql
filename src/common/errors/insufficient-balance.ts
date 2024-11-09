import httpStatus from 'http-status';
import { ApplicationError } from './application';

export class InsufficientBalance extends ApplicationError {
  response = 'Insufficient balance';
  code = httpStatus.PAYMENT_REQUIRED;
}
