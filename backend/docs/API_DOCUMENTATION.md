# NextGen Electronics API Documentation

## Search & Filter Products API

### Base URL

```
http://localhost:5000/api
```

## Product Endpoints

### 1. Get Products with Advanced Search & Filtering

**GET** `/products`

#### Query Parameters:

- `search` (string): Search across product name, description, and brand
- `category` (string): Filter by category
- `brand` (string): Filter by brand
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `minStock` (number): Minimum stock filter
- `maxStock` (number): Maximum stock filter
- `inStock` (boolean): Filter by stock availability ("true"/"false")
- `sortBy` (string): Sort field ("name", "price", "stock", "createdAt", "brand", "category")
- `sortOrder` (string): Sort order ("asc" or "desc")
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Items per page (default: 20)

#### Example Requests:

```bash
# Basic search
GET /api/products?search=laptop

# Filter by category and price range
GET /api/products?category=Computers&minPrice=500&maxPrice=2000

# Sort by price ascending
GET /api/products?sortBy=price&sortOrder=asc

# Pagination
GET /api/products?page=2&limit=10

# Complex search with multiple filters
GET /api/products?search=apple&category=Smartphones&minPrice=800&inStock=true&sortBy=price&sortOrder=desc&page=1&limit=20
```

#### Response Format:

```json
{
  "products": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": 999.99,
      "category": "Smartphones",
      "brand": "Apple",
      "stock": 50,
      "images": ["/uploads/image1.jpg"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "isActive": true,
      "tags": ["smartphone", "apple", "iphone"],
      "sku": "APPLE-IPHONE-15",
      "weight": 174,
      "dimensions": {
        "length": 147.6,
        "width": 71.6,
        "height": 7.8
      },
      "ratings": {
        "average": 4.5,
        "count": 120
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 100,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  },
  "filters": {
    "search": "apple",
    "category": "Smartphones",
    "brand": "",
    "minPrice": "800",
    "maxPrice": "",
    "minStock": "",
    "maxStock": "",
    "sortBy": "price",
    "sortOrder": "desc",
    "inStock": "true"
  }
}
```

### 2. Get Product Categories

**GET** `/products/categories`

Returns all unique categories from the database.

#### Response:

```json
["Electronics", "Computers", "Smartphones", "Accessories", "Home Appliances", "Gaming", "Wearables"]
```

### 3. Get Product Brands

**GET** `/products/brands`

Returns all unique brands from the database.

#### Response:

```json
["Apple", "Samsung", "Sony", "LG", "Dell", "HP", "Lenovo"]
```

### 4. Get Search Suggestions

**GET** `/products/search-suggestions?q=search_term`

Returns search suggestions based on product names, brands, and categories.

#### Query Parameters:

- `q` (string): Search query (minimum 2 characters)

#### Response:

```json
[
  {
    "type": "product",
    "value": "iPhone 15 Pro"
  },
  {
    "type": "brand",
    "value": "Apple"
  },
  {
    "type": "category",
    "value": "Smartphones"
  }
]
```

### 5. Get Product Statistics

**GET** `/products/stats`

Returns comprehensive product statistics.

#### Response:

```json
{
  "overall": {
    "totalProducts": 150,
    "totalValue": 150000,
    "avgPrice": 1000,
    "minPrice": 50,
    "maxPrice": 5000,
    "totalStock": 5000,
    "inStockProducts": 120,
    "outOfStockProducts": 30
  },
  "categories": [
    {
      "_id": "Smartphones",
      "count": 45,
      "avgPrice": 1200
    },
    {
      "_id": "Computers",
      "count": 30,
      "avgPrice": 1500
    }
  ],
  "brands": [
    {
      "_id": "Apple",
      "count": 25,
      "avgPrice": 1800
    },
    {
      "_id": "Samsung",
      "count": 20,
      "avgPrice": 900
    }
  ]
}
```

### 6. Get Single Product

**GET** `/products/:id`

Returns a single product by ID.

#### Response:

```json
{
  "_id": "product_id",
  "name": "Product Name",
  "description": "Product description",
  "price": 999.99,
  "category": "Smartphones",
  "brand": "Apple",
  "stock": 50,
  "images": ["/uploads/image1.jpg"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "isActive": true,
  "tags": ["smartphone", "apple", "iphone"],
  "sku": "APPLE-IPHONE-15",
  "weight": 174,
  "dimensions": {
    "length": 147.6,
    "width": 71.6,
    "height": 7.8
  },
  "ratings": {
    "average": 4.5,
    "count": 120
  }
}
```

## Admin Endpoints (Require Authentication)

### 7. Create Product

**POST** `/products`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 999.99,
  "category": "Smartphones",
  "brand": "Apple",
  "stock": 50,
  "images": ["/uploads/image1.jpg"],
  "tags": ["smartphone", "apple", "iphone"],
  "sku": "APPLE-IPHONE-15",
  "weight": 174,
  "dimensions": {
    "length": 147.6,
    "width": 71.6,
    "height": 7.8
  }
}
```

### 8. Update Product

**PUT** `/products/:id`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

### 9. Delete Product

**DELETE** `/products/:id`

**Headers:**

```
Authorization: Bearer <token>
```

### 10. Upload Product Image

**POST** `/products/upload-image`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body:**

```
image: <file>
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "error": "Not authorized, token failed"
}
```

### 403 Forbidden

```json
{
  "error": "Admin access required"
}
```

### 404 Not Found

```json
{
  "error": "Product not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Failed to fetch products"
}
```

## Search Features

### Text Search

- Searches across product name, description, and brand
- Case-insensitive
- Partial matching supported
- Multiple terms can be searched simultaneously

### Filtering Options

- **Category**: Filter by product category
- **Brand**: Filter by product brand
- **Price Range**: Filter by minimum and maximum price
- **Stock Range**: Filter by minimum and maximum stock
- **Stock Availability**: Filter by in-stock or out-of-stock items

### Sorting Options

- **Name**: Alphabetical sorting by product name
- **Price**: Numerical sorting by price
- **Stock**: Numerical sorting by stock quantity
- **Created Date**: Chronological sorting by creation date
- **Brand**: Alphabetical sorting by brand
- **Category**: Alphabetical sorting by category

### Pagination

- Configurable page size (default: 20 items per page)
- Page-based navigation
- Total count and page information included in response

## Performance Optimizations

### Database Indexes

- Text index on name, description, and brand fields
- Individual indexes on category, brand, price, stock, and creation date
- Compound indexes for common query combinations

### Query Optimization

- Lean queries for better performance
- Efficient aggregation pipelines for statistics
- Proper error handling and fallbacks

## Usage Examples

### Frontend Integration

```javascript
// Search products
const searchProducts = async (filters) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/products?${params}`);
  return response.json();
};

// Get categories
const getCategories = async () => {
  const response = await fetch("/api/products/categories");
  return response.json();
};

// Get brands
const getBrands = async () => {
  const response = await fetch("/api/products/brands");
  return response.json();
};

// Get search suggestions
const getSuggestions = async (query) => {
  const response = await fetch(`/api/products/search-suggestions?q=${query}`);
  return response.json();
};
```
