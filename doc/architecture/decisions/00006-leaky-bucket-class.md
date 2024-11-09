# 6. Leaky Bucket Rate Limiter with Redis
Date: 2024-11-08

## Status
Accepted

## Context
In a multi-tenant application with high request volumes, it's crucial to control the rate of requests per tenant to prevent resource overuse, protect against abuse, and ensure fair usage across tenants. Implementing a rate-limiting strategy using the "leaky bucket" algorithm provides a balanced approach, allowing a burst of requests up to a maximum limit, while gradually refilling the token count over time.

The Redis-backed leaky bucket rate limiter was chosen because Redis can efficiently store and update the rate-limit state across distributed instances, ensuring accurate and low-latency enforcement even under high loads. This rate-limiter solution integrates with the middleware of the application, where it dynamically adjusts allowed requests based on each tenant's historical request pattern.

## Decision
We decided to implement a LeakyBucket class for rate limiting, using Redis to store the token count and timestamp information per tenant. This class follows a leaky bucket algorithm, where tokens are consumed with each request, and a refill process periodically adds tokens back, allowing bursts of requests but maintaining an overall limit over time.

## Consequences
Using a Redis-backed leaky bucket rate limiter has several implications:

## Positive Consequences
- Efficient, Distributed Rate Limiting: Redis allows us to perform rate-limiting checks and updates efficiently, even in distributed application environments. This ensures consistent enforcement of rate limits without a central bottleneck.
- Smooth Control of Request Flow: The leaky bucket approach allows short bursts of requests up to a maximum but limits sustained traffic, providing a smooth, gradual control over incoming request rates while allowing flexibility.
- Tenant-Specific Rate Management: By tracking tokens per tenant, the system can manage request limits for each tenant independently, ensuring fair usage across all tenants in the multi-tenant environment.
- Scalability: Redis's high performance with read and write operations ensures that the rate limiter remains efficient and responsive, even as the application scales.
## Negative Consequences
- Dependency on Redis Availability: Since the rate limiter relies on Redis, any issues with Redis availability or latency could affect the performance and accuracy of rate limiting.
- Complexity in Token Refill Timing: Handling token refill intervals and checking elapsed time requires careful management to avoid under- or over-counting tokens, especially under high request loads.
- Increased Latency on Failure: In case of Redis connection issues, the rate limiter may need fallback mechanisms, as lack of token data could prevent valid requests from proceeding smoothly.

In summary, implementing a Redis-backed leaky bucket rate limiter offers a scalable, flexible approach to managing request rates in a multi-tenant application. It improves system resilience against request bursts while ensuring that tenants adhere to their allocated usage limits. This setup balances efficiency and fairness, making it well-suited for applications with diverse and dynamic tenant requirements.
