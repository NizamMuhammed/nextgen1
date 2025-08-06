# NextGen Electronics Backend

Node.js (Express) REST API for the NextGen Electronics platform with advanced search and filtering capabilities.

## Features

- **Advanced Search & Filtering**: Comprehensive product search across name, description, and brand
- **Dynamic Filtering**: Filter by category, brand, price range, stock availability
- **Sorting Options**: Sort by name, price, stock, creation date, brand, or category
- **Pagination**: Efficient pagination with configurable page sizes
- **Search Suggestions**: Real-time search suggestions for better UX
- **Product Statistics**: Comprehensive analytics and reporting
- **Image Upload**: Secure file upload for product images
- **Authentication**: JWT-based authentication with role-based access
- **MongoDB Integration**: Optimized database queries with proper indexing

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file with your MongoDB URI:

   ```
   # MongoDB connection string for NextGen Electronics
   MONGODB_URI=mongodb+srv://admin:L5Rqtki9Q7JcZjb9@cluster0.mongodb.net/nextgen?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```

3. Start the server:
   ```
   npm run dev
   ```

## Scripts

- `npm run dev` — Start with nodemon (development)
- `npm start` — Start with Node.js (production)
- `node test-search.js` — Run search functionality tests

## API Endpoints

### Product Search & Filtering

#### GET `/api/products`

Advanced product search with filtering, sorting, and pagination.

**Query Parameters:**

- `search` - Search across name, description, and brand
- `category` - Filter by category
- `brand` - Filter by brand
- `minPrice` / `maxPrice` - Price range filter
- `minStock` / `maxStock` - Stock range filter
- `inStock` - Filter by stock availability ("true"/"false")
- `sortBy` - Sort field ("name", "price", "stock", "createdAt", "brand", "category")
- `sortOrder` - Sort order ("asc" or "desc")
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Example:**

```bash
GET /api/products?search=iphone&category=Smartphones&minPrice=800&sortBy=price&sortOrder=desc&page=1&limit=20
```

#### GET `/api/products/categories`

Get all unique product categories.

#### GET `/api/products/brands`

Get all unique product brands.

#### GET `/api/products/search-suggestions?q=query`

Get search suggestions for autocomplete.

#### GET `/api/products/stats`

Get comprehensive product statistics.

#### GET `/api/products/:id`

Get a single product by ID.

### Admin Endpoints (Require Authentication)

#### POST `/api/products`

Create a new product (Admin only).

#### PUT `/api/products/:id`

Update a product (Admin only).

#### DELETE `/api/products/:id`

Delete a product (Admin only).

#### POST `/api/products/upload-image`

Upload a product image (Admin only).

### Authentication

#### POST `/api/auth/signup`

Register a new user.

#### POST `/api/auth/login`

Login user and get JWT token.

### User Management (Admin only)

#### GET `/api/users`

Get all users.

#### POST `/api/users`

Create a new user.

#### PUT `/api/users/:id`

Update a user.

#### DELETE `/api/users/:id`

Delete a user.

## Search Features

### Text Search

- Searches across product name, description, and brand
- Case-insensitive with partial matching
- Supports multiple search terms

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

## Database Schema

### Product Model

```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  category: String,
  brand: String (required),
  stock: Number (default: 0),
  images: [String],
  createdAt: Date (default: now),
  updatedAt: Date (default: now),
  isActive: Boolean (default: true),
  tags: [String],
  sku: String,
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  ratings: {
    average: Number (default: 0),
    count: Number (default: 0)
  }
}
```

## Performance Optimizations

### Database Indexes

- Text index on name, description, and brand fields
- Individual indexes on category, brand, price, stock, and creation date
- Compound indexes for common query combinations

### Query Optimization

- Lean queries for better performance
- Efficient aggregation pipelines for statistics
- Proper error handling and fallbacks

## Testing

Run the search functionality tests:

```bash
node test-search.js
```

This will:

1. Seed the database with sample products
2. Test all search and filter functionality
3. Verify pagination and sorting
4. Check statistics and suggestions

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Validation errors
- **401 Unauthorized**: Invalid or missing authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server errors

## Security Features

- JWT-based authentication
- Role-based access control (Admin/Customer)
- Input validation and sanitization
- Secure file upload handling
- CORS configuration

## Development

### Adding New Features

1. Update the Product model if needed
2. Add new routes in the appropriate router file
3. Update the API documentation
4. Add tests for new functionality

### Database Migrations

When updating the Product schema:

1. Update the model definition
2. Create database indexes if needed
3. Test with sample data
4. Update documentation

## Deployment

1. Set environment variables:

   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `PORT`: Server port (default: 5000)

2. Install dependencies:

   ```bash
   npm install --production
   ```

3. Start the server:
   ```bash
   npm start
   ```

## API Documentation

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
