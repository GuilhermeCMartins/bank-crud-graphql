// Ignoring the type warning as GraphQLResponse is the expected parameter.
// biome-ignore lint: The interface can't be imported at the moment, but we know the structure.
export function formatGraphQLResponse(response: any) {
  if (response.errors) {
    const { data, ...rest } = response;
    return { ...rest };
  }

  return response;
}
