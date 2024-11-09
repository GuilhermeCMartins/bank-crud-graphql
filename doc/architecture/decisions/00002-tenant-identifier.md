# 2. Tenant Middleware Identifier

Date: 2024-11-06

## Status

Accepted

## Context

In a multi-tenant system, it is essential to associate each request with the correct tenant to ensure data isolation and tenant-specific configuration. The tenantIdentifier middleware serves this purpose by intercepting requests, validating the tenant ID, and configuring it in the application context for consistent access throughout request processing.

## Decision

We decided to implement a middleware to identify and set up the tenant at the beginning of each request. The middleware retrieves the tenantId from the request header, verifies its existence and active status in the system, and sets it in the TenantPlugin to ensure the tenant context is accessible throughout the processing lifecycle of the request.

## Consequences

Using a middleware for tenant identification has multiple implications:

## Positive Consequences

- Centralized Logic: By consolidating tenant identification and validation within a single middleware, we avoid code duplication and ensure consistent tenant access control across routes.
- Enhanced Security: Validating tenants at the middleware level ensures that only active and authorized tenants can access the system, helping prevent unauthorized or malicious access.
- Data Isolation: Tenant filtering can be applied early, making it easy to limit data access based on the tenant and ensuring that each tenant only accesses their own data, even when sharing a database.
- Scalability: This approach provides flexibility for future expansion, as any additional tenant-specific logic or validation can be incorporated into the middleware without modifying other parts of the codebase.

## Negative Consequences
- Request Overhead: The middleware introduces a small performance overhead, as each request requires tenant validation, potentially involving database checks.
- Dependency on Header: This implementation relies on the presence of an x-tenant-id header. Missing or incorrect headers will result in validation errors, which may require careful handling by client applications.


In summary, implementing tenant identification via middleware improves security, organization, and scalability in a multi-tenant architecture, ensuring that each request is processed within the correct tenant context.
