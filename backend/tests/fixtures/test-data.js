// Test data fixtures for comprehensive testing

// Valid user data for positive test cases
const validUsers = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "SecurePass123!",
    role: "customer",
  },
  {
    name: "Alice Smith",
    email: "alice.smith@example.com",
    password: "StrongPwd789#",
    role: "customer",
  },
  {
    name: "Admin User",
    email: "admin@nextgen.com",
    password: "AdminPass456$",
    role: "admin",
  },
  {
    name: "Staff Member",
    email: "staff@nextgen.com",
    password: "StaffPass321@",
    role: "staff",
  },
];

// Invalid user data for negative test cases
const invalidUsers = [
  // Empty Fields
  { name: "", email: "test@example.com", password: "ValidPass123!", role: "customer" },
  { name: "Test User", email: "", password: "ValidPass123!", role: "customer" },
  { name: "Test User", email: "test@example.com", password: "", role: "customer" },

  // Null Fields
  { name: null, email: "test@example.com", password: "ValidPass123!", role: "customer" },
  { name: "Test User", email: null, password: "ValidPass123!", role: "customer" },
  { name: "Test User", email: "test@example.com", password: null, role: "customer" },

  // Invalid Email Format
  { name: "Test User", email: "invalid-email", password: "ValidPass123!", role: "customer" },
  { name: "Test User", email: "user@.com", password: "ValidPass123!", role: "customer" },
  { name: "Test User", email: "@example.com", password: "ValidPass123!", role: "customer" },
  { name: "Test User", email: "user@example", password: "ValidPass123!", role: "customer" },

  // Invalid Password Format
  { name: "Test User", email: "test@example.com", password: "password", role: "customer" },
  { name: "Test User", email: "test@example.com", password: "Password", role: "customer" },
  { name: "Test User", email: "test@example.com", password: "password123", role: "customer" },
  { name: "Test User", email: "test@example.com", password: "12345678", role: "customer" },

  // Invalid Role
  { name: "Test User", email: "test@example.com", password: "ValidPass123!", role: "invalid" },
  { name: "Test User", email: "test@example.com", password: "ValidPass123!", role: "" },
];

// Valid product data
const validProducts = [
  {
    name: "iPhone 15 Pro",
    description: "Latest iPhone with advanced camera system and A17 Pro chip",
    price: 999.99,
    category: "Smartphones",
    brand: "Apple",
    stock: 50,
    tags: ["smartphone", "apple", "iphone", "5g", "camera"],
    sku: "APPLE-IPHONE-15-PRO",
    weight: 187,
    dimensions: { length: 147.6, width: 71.6, height: 7.8 },
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen and advanced AI features",
    price: 1199.99,
    category: "Smartphones",
    brand: "Samsung",
    stock: 30,
    tags: ["smartphone", "samsung", "android", "5g", "ai"],
    sku: "SAMSUNG-GALAXY-S24-ULTRA",
    weight: 232,
    dimensions: { length: 163.4, width: 79.0, height: 8.6 },
  },
  {
    name: "MacBook Pro 16-inch",
    description: "Powerful laptop with M3 Pro chip for professionals",
    price: 2499.99,
    category: "Computers",
    brand: "Apple",
    stock: 25,
    tags: ["laptop", "apple", "macbook", "professional", "m3"],
    sku: "APPLE-MBP-16-M3",
    weight: 2200,
    dimensions: { length: 355.7, width: 248.1, height: 16.8 },
  },
];

// Invalid product data
const invalidProducts = [
  // Missing Required Fields
  { description: "Test product", price: 100, category: "Test", brand: "Test", stock: 10 },
  { name: "Test Product", price: 100, category: "Test", brand: "Test", stock: 10 },
  { name: "Test Product", description: "Test product", category: "Test", brand: "Test", stock: 10 },

  // Invalid Data Types
  { name: "Test Product", description: "Test product", price: "invalid", category: "Test", brand: "Test", stock: 10 },
  { name: "Test Product", description: "Test product", price: 100, category: "Test", brand: "Test", stock: "invalid" },

  // Negative Values
  { name: "Test Product", description: "Test product", price: -100, category: "Test", brand: "Test", stock: 10 },
  { name: "Test Product", description: "Test product", price: 100, category: "Test", brand: "Test", stock: -10 },

  // Empty Strings
  { name: "", description: "Test product", price: 100, category: "Test", brand: "Test", stock: 10 },
  { name: "Test Product", description: "", price: 100, category: "Test", brand: "Test", stock: 10 },
];

// Valid order data
const validOrders = [
  {
    orderItems: [
      {
        product: "507f1f77bcf86cd799439011", // Valid ObjectId
        quantity: 2,
        price: 199.98,
      },
    ],
    shippingAddress: {
      fullName: "John Doe",
      address: "123 Main St",
      city: "New York",
      postalCode: "10001",
      country: "USA",
    },
    paymentMethod: "credit_card",
    itemsPrice: 199.98,
    taxPrice: 19.99,
    shippingPrice: 10.0,
    totalPrice: 229.97,
  },
];

// Invalid order data
const invalidOrders = [
  // Empty order items
  {
    orderItems: [],
    shippingAddress: {
      fullName: "John Doe",
      address: "123 Main St",
      city: "New York",
      postalCode: "10001",
      country: "USA",
    },
    paymentMethod: "credit_card",
  },

  // Missing shipping address
  {
    orderItems: [
      {
        product: "507f1f77bcf86cd799439011",
        quantity: 1,
        price: 99.99,
      },
    ],
    paymentMethod: "credit_card",
  },

  // Missing payment method
  {
    orderItems: [
      {
        product: "507f1f77bcf86cd799439011",
        quantity: 1,
        price: 99.99,
      },
    ],
    shippingAddress: {
      fullName: "John Doe",
      address: "123 Main St",
      city: "New York",
      postalCode: "10001",
      country: "USA",
    },
  },
];

// Valid review data
const validReviews = [
  {
    rating: 5,
    comment: "Excellent product! Highly recommended.",
    product: "507f1f77bcf86cd799439011",
  },
  {
    rating: 4,
    comment: "Good quality, fast delivery.",
    product: "507f1f77bcf86cd799439011",
  },
];

// Invalid review data
const invalidReviews = [
  // Invalid rating
  { rating: 6, comment: "Great product", product: "507f1f77bcf86cd799439011" },
  { rating: 0, comment: "Great product", product: "507f1f77bcf86cd799439011" },
  { rating: -1, comment: "Great product", product: "507f1f77bcf86cd799439011" },

  // Missing required fields
  { comment: "Great product", product: "507f1f77bcf86cd799439011" },
  { rating: 5, product: "507f1f77bcf86cd799439011" },
  { rating: 5, comment: "Great product" },
];

module.exports = {
  validUsers,
  invalidUsers,
  validProducts,
  invalidProducts,
  validOrders,
  invalidOrders,
  validReviews,
  invalidReviews,
};
