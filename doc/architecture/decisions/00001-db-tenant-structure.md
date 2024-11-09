# 1. Multi-tenant Database Structure

Date: 2024-11-06

## Status

Accepted

## Context

Our multi-tenant application requires a database structure that supports tenant isolation while balancing performance, scalability, and maintainability in MongoDB. MongoDB provides two main options for organizing multi-tenant data:

- Using a Separate Collection per Tenant
- Using a Shared Collection with a Tenant Identifier Field

Each approach has distinct advantages and drawbacks in terms of data isolation, management complexity, and performance. Our goal is to choose an architecture that efficiently handles data access, simplifies management, and scales with an increasing number of tenants.

## Decision

We will use a single shared collection structure with a dedicated tenantId field to differentiate tenant data within each collection.

Rationale for Choosing a Shared Collection with Tenant Identifier

- Simplicity and Scalability:
With a shared collection, we avoid the need to create, maintain, and manage a separate collection for each tenant. This approach simplifies database administration, particularly as we add new tenants.
MongoDB is optimized to handle large volumes of data within a single collection, making this approach scalable even as tenant data grows.

- Reduced Operational Overhead:
Managing multiple collections introduces administrative complexity, especially for backups, index maintenance, and data replication.
By using a single collection, we can apply universal indexing and backup processes, reducing operational overhead and the potential for inconsistencies between collections.

- Optimized Indexing and Query Performance:
Using a tenantId field allows us to index data on both tenantId and other frequently queried fields. This indexing strategy can yield performant queries without the need to create custom indices per collection.
Furthermore, MongoDB’s query planner is efficient in handling large collections with the appropriate indexing, so data retrieval filtered by tenantId should remain performant.
Security and Isolation:

Although a single collection holds all tenants' data, the tenantId filter ensures logical separation of data. Additional precautions, such as automated middleware for applying tenantId filtering in all queries, reinforce this isolation and prevent data leakage.
By implementing tenantId at the application layer, we can enforce strict access controls without relying on multiple collections, ensuring tenant data security within the shared structure.

## Consequences

# Positive Consequences
- Efficient Scaling: Our approach allows for straightforward scaling of tenant data without significant increases in management complexity.
- Streamlined Operations: Backup, indexing, and maintenance operations remain centralized, reducing operational complexity and overhead.
- Logical Isolation with Additional Safeguards: While data is isolated at a logical level, we will implement middleware to enforce tenantId filtering rigorously in all data operations.

# Negative Consequences
- Potential for Data Leakage: Since all tenants’ data resides within a single collection, any misconfiguration or missed tenantId filter could lead to data exposure between tenants. This increases the risk of accidental data leaks.
- Performance Limitations in Extremely Large Datasets: As data scales significantly across tenants, query performance could degrade, even with indexing. High-volume tenants or very high numbers of tenants could affect performance for all tenants.
- Complexity in Index Management: As tenants grow and their data patterns differ, optimizing indices for diverse tenant needs in a single collection may become challenging. Adding too many indices can increase storage requirements and degrade write performance.
- Limited Data Isolation: Logical isolation via tenantId lacks the physical isolation that separate collections or databases would offer, which could be a concern for tenants with strict data isolation requirements.
