## Express.js REST API

This is a REST API, with MVC architecture.
Built with Express.js and Typescript to act as a template for future projects.
Includes best practices for security, performance and code-readability. Has support for CRUD operations, authentication
with JWT, authorization with user roles.

### Features

- Node.js & Express.js
- Typescript
- MongoDB
- Mongoose
- Zod and Validator.js for validation and sanitization
- Error and Request logging to console and files
- CRUD
- Rate limiting
- Security best practices with packages like Zod, Helmet, Validator, XSS, CORS, JWT and more
- Authentication (JWT) with access and refresh tokens
- Authorization with user roles
- API Layer (Integration) testing with Jest, Supertest and ts-jest

### Features to be added

- Swagger for API documentation
- CSRF protection
- Google OAuth
- ESLint
- Prettier
- Metrics with Prometheus
- Docker
- Redis and advanced rate limiting with rate-limiter-flexible

### API Endpoints

#### Authentication

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

#### Posts

- GET /api/posts
- POST /api/posts
- GET /api/posts/:id
- PUT /api/posts/:id
- DELETE /api/posts/:id

