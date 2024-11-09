import type { ApolloError } from 'apollo-server-koa';
import { ApplicationError } from '@common/errors';

export function formatGraphQLError(error: ApolloError) {
  if (error.originalError instanceof ApplicationError) {
    return {
      message: error.message,
      statusCode: error.originalError.code,
    };
  }

  if (error.extensions?.code === 'GRAPHQL_VALIDATION_FAILED') {
    return {
      message: 'Validation error: Required fields are missing or invalid.',
      details: error.message,
      statusCode: 'VALIDATION_ERROR',
    };
  }

  return {
    message: 'Internal server error',
    statusCode: 'INTERNAL_SERVER_ERROR',
  };
}
