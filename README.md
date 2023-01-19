## Express.js REST API

This is a REST API, with MVC architecture.
Built with Express.js and Typescript to act as a template for future projects.
Includes best practices for security, performance and code architecture. Has support for CRUD operations, authentication
with JWT and CSRF Tokens, authorization with user roles.

### Features

- Node.js & Express.js
- Typescript
- MongoDB
- Mongoose
- CRUD operations
- Authentication (JWT) with access and refresh tokens
- Security best practices with packages like Zod, Helmet, Validator, XSS, CORS, JWT and more
- Zod and Validator.js for validation and sanitization
- Error and Request logging to console and files
- Authorization with user roles
- API Layer (Integration) testing with Jest, Supertest and ts-jest (Not fully implemented)
- Rate limiting
- CSRF protection with anti-CSRF Tokens

### Features to be added

- Swagger for API documentation
- Google OAuth
- Metrics with Prometheus
- Docker
- Redis and advanced rate limiting with rate-limiter-flexible

### API Endpoints

#### Authentication

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh-token

#### Posts

- GET /api/posts
- POST /api/posts
- GET /api/posts/:id
- PUT /api/posts/:id
- DELETE /api/posts/:id

