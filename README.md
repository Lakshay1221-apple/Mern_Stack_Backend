# E-Commerce API

A Node.js and Express REST API for an e-commerce platform. The service uses MongoDB for persistence, JWTs for authentication, and HTTP-only cookies for session transport.

## Features

- User registration, login, and logout
- JWT-based authentication with cookie support
- Product creation, listing, retrieval, updating, and deletion
- Role-based access for protected product operations
- Product search, filtering, and pagination hooks
- Centralized asynchronous error handling

## Technology Stack

- Node.js with ES modules
- Express 5
- MongoDB with Mongoose
- JSON Web Tokens
- bcryptjs for password hashing
- dotenv for environment configuration

## Project Structure

```text
backend/
├── config/        Database and environment configuration
├── controller/    Request handlers
├── middleware/    Authentication and error middleware
├── models/        Mongoose schemas
├── routes/        API route definitions
└── utils/         JWT and API helper utilities
docs/
└── API.md         Endpoint reference
```

## Prerequisites

- Node.js 18 or later
- MongoDB running locally or a reachable MongoDB deployment
- npm

## Installation

```bash
git clone <repository-url>
cd E-commerce
npm install
```

Create or update `backend/config/config.env`:

```env
PORT=8000
DB_URL=mongodb://localhost:27017/E-Commerce
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRE=7d
EXPIRE_COOKIE=2
```

Do not commit real secrets. Use a unique JWT secret for each environment.

## Running the API

Start the development server with:

```bash
npm run dev
```

The API is available at `http://localhost:8000/api/v1` by default. The server must be able to connect to MongoDB before it starts accepting requests.

## API Overview

| Method | Endpoint | Authentication | Purpose |
| --- | --- | --- | --- |
| `POST` | `/register` | Public | Create a user account |
| `POST` | `/login` | Public | Authenticate a user |
| `GET` | `/logout` | Public | Clear the authentication cookie |
| `GET` | `/products` | Required | List products |
| `GET` | `/product/:id` | Required | Get one product |
| `POST` | `/products` | Admin | Create a product |
| `PUT` | `/product/:id` | Required | Update a product |
| `DELETE` | `/product/:id` | Required | Delete a product |

All endpoints are prefixed with `/api/v1`. See [docs/API.md](docs/API.md) for request fields, authentication details, and response examples.

## Development Notes

- Passwords are hashed before being stored.
- Product routes expect the JWT to be provided in the `token` cookie.
- Product creation is restricted to users with the `admin` role.
- Use a REST client such as Postman or Insomnia to exercise the API.

## License

This project is currently provided for development and educational use. Add a project license before distributing it publicly.
