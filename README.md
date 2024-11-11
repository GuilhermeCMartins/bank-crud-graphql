## Multi-Tenant API Project - README
This project implements a multi-tenant API using Node.js, Koa, MongoDB, and Mongoose. It enables managing data for different tenants independently, applying a tenant middleware and plugin to ensure data security and consistency.

# Table of Contents
- Project Description
- Technologies Used
- Installation and Configuration
- Potential Future Improvements

# Project Description

The developed API manages user accounts and transactions, ensuring data isolation for each tenant so that data is accessible only to the specific tenant. The API uses middleware to identify the tenant via the x-tenant-id header and a Mongoose plugin to automatically associate database operations with the correct tenant.

# Technologies Used

- Node.js: Platform for running server-side JavaScript code.
- Koa: Lightweight and customizable framework for creating APIs and web applications.
- MongoDB: Document-oriented NoSQL database, used for scalable data storage.
- Mongoose: ODM (Object Data Modeling) library for MongoDB, making schema management easier.
- UUID: To generate unique account identifiers.
- TypeScript: A JavaScript superset that adds static typing and other features for improved code safety.

# Installation and Configuration

```
docker-compose up -d
```

- Just copy .env.example to .env to run the app

```
pnpm dev
```


# Potential Future Improvements

- Identify tenant based on JWT Token
- Implements all differents validations from BACEN
- Add logger to application
