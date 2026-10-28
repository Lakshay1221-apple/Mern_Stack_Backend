# E-Commerce Store

Full-stack e-commerce application with a React/Vite frontend and an
Express/MongoDB backend. The frontend is available at `http://localhost:5173`
and proxies `/api` requests to the backend on port `8000`.

## Features

- Product listing, search, filtering, pagination, and product details
- User registration, login, logout, and JWT authentication
- HTTP-only cookie-based sessions
- Admin product creation, updating, and deletion
- Product reviews
- Responsive storefront UI with image slider, cart, and order flows
- Centralized asynchronous error handling
- Docker Compose development environment for MongoDB, backend, and frontend

## Technology stack

### Backend

- Node.js with ES modules
- Express 5
- MongoDB with Mongoose
- JSON Web Tokens
- bcryptjs
- dotenv

### Frontend

- React 19
- Vite
- React Router
- Redux Toolkit and React Redux
- Axios
- Material UI
- React Toastify

## Project structure

```text
.
├── backend/
│   ├── config/        Database and environment configuration
│   ├── controller/    Request handlers
│   ├── middleware/    Authentication and error middleware
│   ├── models/        Mongoose schemas
│   ├── routes/        API route definitions
│   ├── scripts/       Maintenance scripts
│   └── utils/         JWT, API, and email helpers
├── frontend/
│   ├── public/        Static assets
│   └── src/
│       ├── components/ Reusable UI components
│       ├── features/   Redux slices
│       ├── pages/      Application pages
│       └── ...         Styles and application setup
├── compose.yaml       Docker Compose development environment
├── docs/API.md        Detailed API reference
└── package.json       Backend scripts and dependencies
```

## Prerequisites

For local development:

- Node.js 18 or later
- npm
- MongoDB running locally or a reachable MongoDB deployment

For Docker development:

- Docker Engine
- Docker Compose

## Local installation

Clone the repository and install dependencies for both applications:

```bash
git clone <repository-url>
cd E-commerce
npm install
npm --prefix frontend install
```

Create `backend/config/config.env` with environment-specific values:

```env
PORT=8000
DB_URL=mongodb://localhost:27017/E-Commerce
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRE=7d
EXPIRE_COOKIE=2
```

Do not commit real passwords, JWT secrets, SMTP credentials, or other
secrets. Use a unique `JWT_SECRET` for each environment.

## Run locally

Start the backend from the repository root:

```bash
npm run dev
```

Start the frontend in a second terminal:

```bash
npm --prefix frontend run dev
```

Open [http://localhost:5173](http://localhost:5173). The Vite development
server proxies requests beginning with `/api` to `http://localhost:8000`.

Useful frontend commands:

```bash
npm --prefix frontend run build
npm --prefix frontend run lint
npm --prefix frontend run preview
```

The backend API base URL is
[http://localhost:8000/api/v1](http://localhost:8000/api/v1).

## Run with Docker Compose

The Compose setup starts MongoDB, the backend, and the frontend:

```bash
docker compose up -d --build
```

Open [http://localhost:5173](http://localhost:5173), then check service status
with:

```bash
docker compose ps
```

View logs when diagnosing startup or API issues:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongo
```

Stop the services without deleting the MongoDB volume:

```bash
docker compose down
```

The Compose file requires `MONGO_INITDB_ROOT_USERNAME` and
`MONGO_INITDB_ROOT_PASSWORD` in the root `.env` file. It uses the MongoDB
volume named `mongo_data` for persistence. The backend uses host networking and
connects to the MongoDB service through the configured `DB_URL`; the frontend
uses `BACKEND_URL` to reach the backend.

For more day-to-day Docker commands, see
[`run_docker.md`](run_docker.md).

## API overview

All API routes are prefixed with `/api/v1`.

| Method | Endpoint | Authentication | Purpose |
| --- | --- | --- | --- |
| `POST` | `/register` | Public | Create a user account |
| `POST` | `/login` | Public | Authenticate a user |
| `GET` | `/logout` | Public | Clear the authentication cookie |
| `GET` | `/products` | Public | List products |
| `GET` | `/product/:id` | Public | Get one product |
| `POST` | `/admin/product/create` | Admin | Create a product |
| `PUT` | `/admin/product/:id` | Admin | Update a product |
| `DELETE` | `/admin/product/:id` | Admin | Delete a product |
| `PUT` | `/review` | Authenticated user | Create or update a review |
| `GET` | `/reviews` | Authenticated user | List product reviews |
| `DELETE` | `/reviews` | Authenticated user | Delete a review |

Product listing supports `keyword`, category filters, `page`, and `limit`
query parameters:

```text
GET /api/v1/products?keyword=laptop&category=electronics&page=1&limit=8
```

Successful login and registration issue a JWT in the `token` HTTP-only cookie.
Protected requests must send that cookie. See
[`docs/API.md`](docs/API.md) for request fields and response examples.

## Product image migration

The image migration script starts in dry-run mode and only updates products
with missing or inaccessible image entries:

```bash
npm run migrate:product-images
npm run migrate:product-images:apply
```

Review the dry-run output before applying changes. The script uses the existing
`DB_URL`, preserves other product fields, and does not delete products.

## Troubleshooting

### The frontend shows `502 Bad Gateway` for `/api/v1/products`

This means the Vite proxy cannot reach the backend. Check that the backend is
running and listening on port `8000`:

```bash
curl -i http://localhost:8000/api/v1/products
docker compose logs --tail=100 backend
```

If the backend exits during startup, fix the reported syntax or database
connection error before restarting it:

```bash
docker compose restart backend
```

### The frontend is a blank white page

Check the browser console and Vite logs for a JavaScript parse or module
initialization error. A broken Redux slice or JSX syntax error can prevent
React from mounting even when `http://localhost:5173` itself returns `200`.
After correcting source files, refresh with `Ctrl+Shift+R`.

### Products are unavailable

Confirm that MongoDB is reachable, the backend reports a successful MongoDB
connection, and the selected database contains product records. In Docker,
the bundled MongoDB volume is separate from any MongoDB data installed on the
host.

## License

This project is currently provided for development and educational use. Add a
project license before distributing it publicly.
