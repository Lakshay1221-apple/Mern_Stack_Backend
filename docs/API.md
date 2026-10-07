# API Reference

Base URL:

```text
http://localhost:8000/api/v1
```

## Authentication

Successful registration and login issue a JWT in the `token` HTTP-only cookie. Send that cookie with protected product requests. A client that does not retain cookies must store and resend the cookie explicitly.

## Users

### Register

```http
POST /register
Content-Type: application/json
```

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "strong-password"
}
```

User names must contain 4 to 25 characters, and passwords must contain at least 8 characters.

### Login

```http
POST /login
Content-Type: application/json
```

```json
{
  "email": "jane@example.com",
  "password": "strong-password"
}
```

### Logout

```http
GET /logout
```

Clears the `token` cookie.

## Products

Product endpoints require a valid `token` cookie unless noted otherwise.

### List products

```http
GET /products?keyword=laptop&category=electronics&page=1
Cookie: token=<jwt>
```

The endpoint supports query-based search, filtering, and pagination. See the response metadata for the product count and current page.

### Get a product

```http
GET /product/:id
Cookie: token=<jwt>
```

### Create a product

Requires an authenticated user with the `admin` role.

```http
POST /products
Content-Type: application/json
Cookie: token=<jwt>
```

```json
{
  "name": "Wireless Keyboard",
  "description": "Compact mechanical keyboard",
  "price": 79.99,
  "category": "electronics",
  "stock": 25,
  "image": [
    {
      "public_id": "keyboard-001",
      "url": "https://example.com/keyboard.jpg"
    }
  ],
  "user": "<user-id>"
}
```

Required product fields are `name`, `description`, `price`, `category`, `stock`, `image`, and `user`.

### Update a product

```http
PUT /product/:id
Content-Type: application/json
Cookie: token=<jwt>
```

Send one or more product fields to update. Mongoose validators run during the update.

### Delete a product

```http
DELETE /product/:id
Cookie: token=<jwt>
```

## Common Errors

Errors use a JSON response with a `success` flag and an error message. Common status codes include:

| Status | Meaning |
| --- | --- |
| `400` | Invalid or incomplete request |
| `401` | Missing or invalid authentication |
| `403` | Authenticated user lacks the required role |
| `404` | Resource or page was not found |
| `500` | Unexpected server error |