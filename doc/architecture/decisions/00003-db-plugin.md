# 3. Tenant Plugin for Mongoose Models
Date: 2024-11-06

## Status
Accepted

## Context
In a multi-tenant application, each query and modification to the database should be scoped to a specific tenant to ensure data isolation and avoid potential data leaks between tenants. By using a plugin that automatically handles tenant scoping at the schema level, we avoid the need to explicitly pass tenant identifiers in every service or database call, simplifying development and reducing the potential for errors.

## Decision
We decided to implement a TenantPlugin for Mongoose schemas. This plugin is applied to each schema that requires tenant scoping, ensuring that all relevant database operations (such as find, update, delete) automatically include a filter for the current tenant. The tenant ID is set in the middleware using a static property, which allows it to be shared consistently across operations.

## Consequences
Using a plugin to handle tenant scoping in Mongoose models has several implications:

## Positive Consequences
- Consistency and Simplification: The plugin eliminates the need to manually add tenant filters in every database query, reducing the risk of oversight. This approach ensures that all tenant-scoped operations consistently include the tenant filter without additional code.
- Reduced Code Duplication: By handling tenant scoping at the schema level, we avoid repeating tenant-related checks in each service function, making the codebase cleaner and reducing maintenance overhead.
- Improved Security: Automatic tenant scoping prevents accidental access to unauthorized data, as each query is constrained to the tenant’s context through the plugin. This reduces the likelihood of data leakage across tenants.
- Flexible Configuration: If additional tenant-related behavior needs to be added (e.g., logging, auditing), it can be centralized in the plugin, allowing us to extend functionality without modifying individual services.

## Negative Consequences
- Dependence on Static Context: The plugin relies on a static tenant ID, which can introduce limitations in certain asynchronous or nested request scenarios. Managing tenant contexts in a multi-threaded environment may require additional handling to ensure isolation.
- Reduced Flexibility in Complex Queries: While the plugin simplifies tenant-scoped queries, some complex queries that require multi-tenant access or more dynamic conditions may require custom handling outside the plugin’s scope.

In summary, using a TenantPlugin for automatic tenant scoping at the schema level improves code maintainability, security, and consistency, making it a valuable choice for managing multi-tenant data in Mongoose.
