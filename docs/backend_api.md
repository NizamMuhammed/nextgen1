# NextGen Electronics – Backend REST API Reference

**Version**: 1.0  
**Base URL**: `http://localhost:5000`

## Table of Contents

1. Authentication  
   • POST /api/auth/signup  
   • POST /api/auth/login  
2. Products  
   • GET /api/products  
   • GET /api/products/categories  
   • GET /api/products/:id  
   • POST /api/products  
   • PUT /api/products/:id  
   • DELETE /api/products/:id  
   • POST /api/products/upload-image  
3. Users (Admin)  
   • GET /api/users  
   • POST /api/users  
   • PUT /api/users/:id  
   • DELETE /api/users/:id  
4. File Uploads  
5. Common Error Codes

---

## 1. Authentication

> All authentication routes are **public**. The returned JWT must be supplied in the `Authorization` header (`Bearer <token>`) when calling protected endpoints.

### POST /api/auth/signup

Register a new account.

**Headers**

```
Content-Type: application/json
```

**Body**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "yourStrongPassword",
  "role": "customer" // optional; "customer" (default) or "admin"
}
```

**Success (201)**

```json
{
  "message": "User registered",
  "user": {
    "id": "64fb7f85d29d...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "customer"
  }
}
```

**Example (cURL)**

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret"}'
```

---

### POST /api/auth/login

Authenticate and receive a JWT.

**Body**

```json
{
  "email": "jane@example.com",
  "password": "secret"
}
```

**Success (200)**

```json
{
  "message": "Login successful",
  "token": "<jwt>",
  "user": {
    "id": "64fb...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "customer"
  }
}
```

---

## 2. Products

All product routes are prefixed with `/api/products`.

### GET /api/products

Retrieve every product or filter by query.

| Query | Type | Description |
|-------|------|-------------|
| `search` | string | Case-insensitive match on `name`. |
| `category` | string | Exact match on product `category`. |

```
GET /api/products?search=iphone&category=Smartphones
```

### GET /api/products/categories

Return an array of category strings.

```
[
  "Electronics",
  "Computers",
  "Smartphones",
  ...
]
```

### GET /api/products/:id

Retrieve a single product document by MongoDB id.

### POST /api/products  _(Admin only)_

**Headers**

```
Content-Type: application/json
Authorization: Bearer <jwt>
```

**Body**

```json
{
  "name": "iPhone 15 Pro",
  "description": "Newest Apple flagship phone …",
  "price": 1099.99,
  "category": "Smartphones",
  "images": ["/uploads/1693491505000-iphone.jpg"],
  "stock": 500
}
```

**Success (201)** – returns the created product document.

### PUT /api/products/:id  _(Admin only)_

Update any of the fields listed above. Returns the updated document.

### DELETE /api/products/:id  _(Admin only)_

Remove a product. Returns:

```json
{ "message": "Product removed" }
```

### POST /api/products/upload-image  _(Admin only)_

Upload a single product image.

**Form-data**

| Field | Type | Description |
|-------|------|-------------|
| `image` | file | Image file ≤ ~5 MB |

**Response**

```json
{ "imageUrl": "/uploads/169349...-photo.jpg" }
```

Use the `imageUrl` inside the `images` array when creating or updating a product.

---

## 3. Users (Admin)

All user-management routes require a valid admin JWT.

### GET /api/users

List users (id, name, username, email, role, createdAt).

### POST /api/users

Create a user.

```json
{
  "name": "Alice",
  "username": "alice",
  "email": "alice@example.com",
  "password": "secret",
  "role": "customer" // or "admin"
}
```

### PUT /api/users/:id

Update user information. Omit `password` to leave unchanged.

### DELETE /api/users/:id

Delete a user permanently.

---

## 4. File Uploads

Files are stored in `/backend/uploads` and served statically at `/uploads/<filename>`.

Example URL:

```
http://localhost:5000/uploads/1693491505000-photo.jpg
```

---

## 5. Common Error Codes

| Status | Meaning | Typical Cause |
|--------|---------|---------------|
| 400 | Bad request | Missing body field |
| 401 | Unauthorized | Missing or malformed JWT |
| 403 | Forbidden | JWT valid but role insufficient |
| 404 | Not found | Resource does not exist |
| 409 | Conflict | Duplicate email or username |
| 500 | Internal server error | Unexpected condition |

---

## Quick Start

```bash
# Install & run backend
cd backend && npm install && npm run dev

# Register then login to obtain a token
curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d '{"name":"Admin","email":"admin@example.com","password":"secret","role":"admin"}'

TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"secret"}' | jq -r .token)

# Upload image
curl -X POST http://localhost:5000/api/products/upload-image \
  -H "Authorization: Bearer $TOKEN" \
  -F image=@./iphone.jpg

# Create product (replace <imagePath> with the returned value)
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"iPhone 15 Pro","description":"...","price":1099.99,"category":"Smartphones","images":["<imagePath>"],"stock":500}'
```

---

Enjoy building with the **NextGen Electronics** API!