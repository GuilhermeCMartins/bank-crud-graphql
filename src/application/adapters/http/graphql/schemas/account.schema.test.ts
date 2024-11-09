import { buildSchema, graphql, getIntrospectionQuery } from 'graphql';
import { accountTypeDefs } from '../schemas/account.schema';

describe('Account TypeDefs', () => {
  let schema: ReturnType<typeof buildSchema>;

  beforeAll(() => {
    schema = buildSchema(accountTypeDefs.loc?.source.body || '');
  });

  it('should be a valid GraphQL schema', async () => {
    const query = getIntrospectionQuery();
    const result = await graphql({ schema, source: query });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
  });

  it('should have Account type with correct fields', async () => {
    const query = `
      {
        __type(name: "Account") {
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

    const accountType = response.data?.__type as {
      name: string;
      fields: Array<{
        name: string;
        type: {
          kind: string;
          ofType: { kind: string; name: string | null } | null;
        };
      }>;
    };

    expect(accountType.fields[0]).toEqual({
      name: 'id',
      type: { kind: 'NON_NULL', name: null },
    });
    expect(accountType.fields[1]).toEqual({
      name: 'number',
      type: { kind: 'NON_NULL', name: null },
    });
    expect(accountType.fields[2]).toEqual({
      name: 'holderName',
      type: { kind: 'NON_NULL', name: null },
    });
    expect(accountType.fields[3]).toEqual({
      name: 'balance',
      type: { kind: 'NON_NULL', name: null },
    });
  });

  it('should have getAccounts and getAccountById queries', async () => {
    const query = `
      {
        __schema {
          queryType {
            fields {
              name
            }
          }
        }
      }
    `;

    const response = await graphql({ schema, source: query });

    const queryFields = response.data?.__schema;

    //@ts-ignore
    expect(queryFields.queryType?.fields[0]).toEqual({ name: 'getAccounts' });
    //@ts-ignore
    expect(queryFields.queryType?.fields[1]).toEqual({
      name: 'getAccountById',
    });
  });

  it('should have createAccount and deleteAccount mutations', async () => {
    const query = `
      {
        __schema {
          mutationType {
            fields {
              name
            }
          }
        }
      }
    `;

    const response = await graphql({ schema, source: query });
    const mutationFields = response.data?.__schema;

    //@ts-ignore
    expect(mutationFields.mutationType.fields).toContainEqual({
      name: 'createAccount',
    });
    //@ts-ignore
    expect(mutationFields.mutationType.fields).toContainEqual({
      name: 'deleteAccount',
    });
  });
});
