import { ApplicationError } from '@common/errors';
import { fork } from '@common/loggers';
import httpStatus from 'http-status';
import type { Context } from 'koa';

// Definindo a interface do Logger
interface Logger {
  child: (options: { name: string }) => Logger; // Método para criar um logger filho
  error: (message: string) => void; // Método para registrar erros
}

interface MiddlewareGet {
  log?: Logger; // A propriedade log pode ou não existir
}

type MiddlewareArgs = {
  code: string;
  error: Error;
  set: Context['set'];
  get: MiddlewareGet; // Usando o tipo MiddlewareGet
};

export const ErrorMiddleware = ({
  code: _code,
  error,
  set,
  get,
}: MiddlewareArgs) => {
  let logger: Logger; // Definindo o tipo do logger
  const name = 'error.middleware';

  // Verificando se a propriedade log existe e criando o logger apropriado
  if (!get.log) {
    logger = fork(name);
  } else {
    logger = get.log.child({ name }); // Usando notação de ponto
  }

  logger.error(`Error: ${error.message} => ${error}`);

  if (error.message === 'NOT_FOUND') {
    set.status = httpStatus.NOT_FOUND; // Usando notação de ponto
    return {
      message: 'Not Found',
    };
  }

  if (error instanceof ApplicationError) {
    set.status = error.code; // Usando notação de ponto
    return {
      message: error.message,
    };
  }

  set.status = httpStatus.BAD_REQUEST; // Usando notação de ponto
  return {
    message: 'Bad Request',
  };
};
