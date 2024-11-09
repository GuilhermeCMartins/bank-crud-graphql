import { buildSchema, graphql, getIntrospectionQuery } from 'graphql';
import { transactionTypeDefs } from './transaction.schema';

describe('Transaction TypeDefs', () => {
  let schema: ReturnType<typeof buildSchema>;

  beforeAll(() => {
    schema = buildSchema(transactionTypeDefs.loc?.source.body || '');
  });

  it('should be a valid GraphQL schema', async () => {
    const query = getIntrospectionQuery();
    const result = await graphql({ schema, source: query });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
  });

  it('should have Transaction type with correct fields', async () => {
    const query = `
      {
        __type(name: "Transaction") {
          name
          fields {
            name
            type {
              kind
              name
            }
          }
        }
      }
    `;

    const response = await graphql({ schema, source: query });

    const transactionType = response.data?.__type as {
      name: string;
      fields: Array<{
        name: string;
        type: {
          kind: string;
          ofType: { kind: string; name: string | null } | null;
        };
      }>;
    };

    expect(transactionType.fields[0]).toEqual({
      name: 'id',
      type: { kind: 'NON_NULL', name: null },
    });
    expect(transactionType.fields[1]).toEqual({
      name: 'receiver',
      type: { kind: 'NON_NULL', name: null },
    });
    expect(transactionType.fields[2]).toEqual({
      name: 'sender',
      type: { kind: 'NON_NULL', name: null },
    });
    expect(transactionType.fields[3]).toEqual({
      name: 'amount',
      type: { kind: 'NON_NULL', name: null },
    });
  });
});
