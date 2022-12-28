## Express.js REST API

This is a REST API, with MVC architecture. 
Built with Express.js and Typescript to act as a template for future projects.
Has support for CRUD operations, authentication with JWT, authorization with user roles.

### Features

-  Express.js
-  Typescript
-  MongoDB
-  Mongoose
-  Zod for validation
-  Express-validator for validation and sanitization
-  Error and Request logging
-  Jest for testing
-  ESLint
-  Prettier
-  Swagger for API documentation
-  Docker
-  CRUD 
-  Security best practices with Zod, Helmet, Validator, XSS, CORS, JWT and more
-  Authentication (JWT) with access and refresh tokens
-  When logged in, you receive a JWT access and refresh token, and then you can use the access token to access protected routes, and the refresh token to get a new access token when the current one expires
-  Authorization with user roles

### API Endpoints

#### Authentication

-  POST /api/auth/register
-  POST /api/auth/login

