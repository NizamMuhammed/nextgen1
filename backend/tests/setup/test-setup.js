const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Cleanup after each test
afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Cleanup after all tests
afterAll(async () => {
  // Close database connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  // Stop the in-memory MongoDB instance
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// Global test utilities
global.testUtils = {
  // Helper to create test user
  createTestUser: async (userData = {}) => {
    const User = require("../../models/User");
    const defaultUser = {
      name: "Test User",
      email: "test@example.com",
      password: "TestPass123!",
      role: "customer",
      ...userData,
    };
    return await User.create(defaultUser);
  },

  // Helper to create test product
  createTestProduct: async (productData = {}) => {
    const Product = require("../../models/Product");
    const defaultProduct = {
      name: "Test Product",
      description: "Test product description",
      price: 99.99,
      category: "Test Category",
      brand: "Test Brand",
      stock: 10,
      tags: ["test"],
      sku: "TEST-SKU-001",
      ...productData,
    };
    return await Product.create(defaultProduct);
  },

  // Helper to create test order
  createTestOrder: async (orderData = {}) => {
    const Order = require("../../models/Order");
    const defaultOrder = {
      user: new mongoose.Types.ObjectId(),
      orderItems: [
        {
          product: new mongoose.Types.ObjectId(),
          quantity: 1,
          price: 99.99,
        },
      ],
      shippingAddress: {
        fullName: "Test User",
        address: "123 Test St",
        city: "Test City",
        postalCode: "12345",
        country: "Test Country",
      },
      paymentMethod: "credit_card",
      itemsPrice: 99.99,
      taxPrice: 9.99,
      shippingPrice: 10.0,
      totalPrice: 119.98,
      isPaid: false,
      isDelivered: false,
      ...orderData,
    };
    return await Order.create(defaultOrder);
  },
};
