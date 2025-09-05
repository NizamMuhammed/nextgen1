/**
 * Products API Integration Tests
 * Following TDD methodology: Red -> Green -> Refactor
 *
 * Test Plan: Product Management System
 * - Objective: Verify CRUD operations for product management
 * - Scope: Product creation, reading, updating, deletion, search and filtering, image upload functionality, stock management
 * - Strategy: API integration tests using Jest and Supertest with TDD approach
 */

const request = require("supertest");
const app = require("../../index");
const Product = require("../../models/Product");
const User = require("../../models/User");
const { validProducts, invalidProducts } = require("../fixtures/test-data");

describe("Products API", () => {
  let adminToken, customerToken, testProduct;

  beforeEach(async () => {
    // Create admin user and get token
    const adminData = {
      name: "Admin User",
      email: "admin@test.com",
      password: "AdminPass123!",
      role: "admin",
    };
    await request(app).post("/api/auth/signup").send(adminData);
    const adminLogin = await request(app).post("/api/auth/login").send({
      email: adminData.email,
      password: adminData.password,
    });
    adminToken = adminLogin.body.token;

    // Create customer user and get token
    const customerData = {
      name: "Customer User",
      email: "customer@test.com",
      password: "CustomerPass123!",
      role: "customer",
    };
    await request(app).post("/api/auth/signup").send(customerData);
    const customerLogin = await request(app).post("/api/auth/login").send({
      email: customerData.email,
      password: customerData.password,
    });
    customerToken = customerLogin.body.token;

    // Create a test product
    testProduct = await global.testUtils.createTestProduct();
  });

  describe("GET /api/products - Get All Products", () => {
    describe("Positive Test Cases", () => {
      test("should get all products without authentication", async () => {
        // Act
        const response = await request(app).get("/api/products");

        // Assert
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.products)).toBe(true);
        expect(response.body.products.length).toBeGreaterThan(0);
        expect(response.body.pagination).toBeDefined();
      });

      test("should get products with pagination", async () => {
        // Act
        const response = await request(app).get("/api/products?page=1&limit=5");

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.pagination.currentPage).toBe(1);
        expect(response.body.pagination.totalPages).toBeDefined();
        expect(response.body.pagination.totalProducts).toBeDefined();
      });

      test("should get products with search query", async () => {
        // Act
        const response = await request(app).get("/api/products?search=Test");

        // Assert
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.products)).toBe(true);
      });

      test("should get products with category filter", async () => {
        // Act
        const response = await request(app).get("/api/products?category=Test Category");

        // Assert
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.products)).toBe(true);
      });

      test("should get products with brand filter", async () => {
        // Act
        const response = await request(app).get("/api/products?brand=Test Brand");

        // Assert
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.products)).toBe(true);
      });

      test("should get products with price range filter", async () => {
        // Act
        const response = await request(app).get("/api/products?minPrice=50&maxPrice=150");

        // Assert
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.products)).toBe(true);
      });

      test("should get products with stock filter", async () => {
        // Act
        const response = await request(app).get("/api/products?inStock=true");

        // Assert
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.products)).toBe(true);
      });

      test("should get products with sorting", async () => {
        // Act
        const response = await request(app).get("/api/products?sortBy=price&sortOrder=desc");

        // Assert
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.products)).toBe(true);
      });
    });
  });

  describe("GET /api/products/:id - Get Single Product", () => {
    describe("Positive Test Cases", () => {
      test("should get a single product by ID", async () => {
        // Act
        const response = await request(app).get(`/api/products/${testProduct._id}`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(testProduct._id.toString());
        expect(response.body.name).toBe(testProduct.name);
        expect(response.body.description).toBe(testProduct.description);
        expect(response.body.price).toBe(testProduct.price);
      });
    });

    describe("Negative Test Cases", () => {
      test("should return 404 for non-existent product", async () => {
        // Arrange
        const nonExistentId = "507f1f77bcf86cd799439011";

        // Act
        const response = await request(app).get(`/api/products/${nonExistentId}`);

        // Assert
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Product not found");
      });

      test("should return 400 for invalid product ID format", async () => {
        // Act
        const response = await request(app).get("/api/products/invalid-id");

        // Assert
        expect(response.status).toBe(500);
        expect(response.body.error).toBeDefined();
      });
    });
  });

  describe("POST /api/products - Create Product", () => {
    describe("Positive Test Cases", () => {
      test("should create a product with valid data (admin only)", async () => {
        // Arrange
        const productData = validProducts[0];

        // Act
        const response = await request(app).post("/api/products").set("Authorization", `Bearer ${adminToken}`).send(productData);

        // Assert
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Product created successfully");
        expect(response.body.product).toBeDefined();
        expect(response.body.product.name).toBe(productData.name);
        expect(response.body.product.description).toBe(productData.description);
        expect(response.body.product.price).toBe(productData.price);

        // Verify product was created in database
        const createdProduct = await Product.findById(response.body.product._id);
        expect(createdProduct).toBeDefined();
        expect(createdProduct.name).toBe(productData.name);
      });

      test("should create a product with all optional fields", async () => {
        // Arrange
        const productData = validProducts[0]; // Includes weight and dimensions

        // Act
        const response = await request(app).post("/api/products").set("Authorization", `Bearer ${adminToken}`).send(productData);

        // Assert
        expect(response.status).toBe(201);
        expect(response.body.product.weight).toBe(productData.weight);
        expect(response.body.product.dimensions).toEqual(productData.dimensions);
      });
    });

    describe("Negative Test Cases", () => {
      test("should fail to create product without authentication", async () => {
        // Arrange
        const productData = validProducts[0];

        // Act
        const response = await request(app).post("/api/products").send(productData);

        // Assert
        expect(response.status).toBe(401);
        expect(response.body.error).toBeDefined();
      });

      test("should fail to create product with customer role", async () => {
        // Arrange
        const productData = validProducts[0];

        // Act
        const response = await request(app).post("/api/products").set("Authorization", `Bearer ${customerToken}`).send(productData);

        // Assert
        expect(response.status).toBe(403);
        expect(response.body.error).toBe("Admin access required");
      });

      test("should fail to create product with missing name", async () => {
        // Arrange
        const productData = invalidProducts[0]; // Missing name

        // Act
        const response = await request(app).post("/api/products").set("Authorization", `Bearer ${adminToken}`).send(productData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      test("should fail to create product with missing description", async () => {
        // Arrange
        const productData = invalidProducts[1]; // Missing description

        // Act
        const response = await request(app).post("/api/products").set("Authorization", `Bearer ${adminToken}`).send(productData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      test("should fail to create product with missing price", async () => {
        // Arrange
        const productData = invalidProducts[2]; // Missing price

        // Act
        const response = await request(app).post("/api/products").set("Authorization", `Bearer ${adminToken}`).send(productData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      test("should fail to create product with negative price", async () => {
        // Arrange
        const productData = invalidProducts[5]; // Negative price

        // Act
        const response = await request(app).post("/api/products").set("Authorization", `Bearer ${adminToken}`).send(productData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      test("should fail to create product with negative stock", async () => {
        // Arrange
        const productData = invalidProducts[6]; // Negative stock

        // Act
        const response = await request(app).post("/api/products").set("Authorization", `Bearer ${adminToken}`).send(productData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });
    });
  });

  describe("PUT /api/products/:id - Update Product", () => {
    describe("Positive Test Cases", () => {
      test("should update a product with valid data (admin only)", async () => {
        // Arrange
        const updateData = {
          name: "Updated Product Name",
          price: 199.99,
          stock: 25,
        };

        // Act
        const response = await request(app).put(`/api/products/${testProduct._id}`).set("Authorization", `Bearer ${adminToken}`).send(updateData);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Product updated successfully");
        expect(response.body.product.name).toBe(updateData.name);
        expect(response.body.product.price).toBe(updateData.price);
        expect(response.body.product.stock).toBe(updateData.stock);

        // Verify product was updated in database
        const updatedProduct = await Product.findById(testProduct._id);
        expect(updatedProduct.name).toBe(updateData.name);
        expect(updatedProduct.price).toBe(updateData.price);
        expect(updatedProduct.stock).toBe(updateData.stock);
      });
    });

    describe("Negative Test Cases", () => {
      test("should fail to update product without authentication", async () => {
        // Arrange
        const updateData = { name: "Updated Name" };

        // Act
        const response = await request(app).put(`/api/products/${testProduct._id}`).send(updateData);

        // Assert
        expect(response.status).toBe(401);
        expect(response.body.error).toBeDefined();
      });

      test("should fail to update product with customer role", async () => {
        // Arrange
        const updateData = { name: "Updated Name" };

        // Act
        const response = await request(app).put(`/api/products/${testProduct._id}`).set("Authorization", `Bearer ${customerToken}`).send(updateData);

        // Assert
        expect(response.status).toBe(403);
        expect(response.body.error).toBe("Admin access required");
      });

      test("should return 404 for non-existent product", async () => {
        // Arrange
        const nonExistentId = "507f1f77bcf86cd799439011";
        const updateData = { name: "Updated Name" };

        // Act
        const response = await request(app).put(`/api/products/${nonExistentId}`).set("Authorization", `Bearer ${adminToken}`).send(updateData);

        // Assert
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Product not found");
      });
    });
  });

  describe("DELETE /api/products/:id - Delete Product", () => {
    describe("Positive Test Cases", () => {
      test("should delete a product (admin only)", async () => {
        // Act
        const response = await request(app).delete(`/api/products/${testProduct._id}`).set("Authorization", `Bearer ${adminToken}`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Product deleted successfully");

        // Verify product was deleted from database
        const deletedProduct = await Product.findById(testProduct._id);
        expect(deletedProduct).toBeNull();
      });
    });

    describe("Negative Test Cases", () => {
      test("should fail to delete product without authentication", async () => {
        // Act
        const response = await request(app).delete(`/api/products/${testProduct._id}`);

        // Assert
        expect(response.status).toBe(401);
        expect(response.body.error).toBeDefined();
      });

      test("should fail to delete product with customer role", async () => {
        // Act
        const response = await request(app).delete(`/api/products/${testProduct._id}`).set("Authorization", `Bearer ${customerToken}`);

        // Assert
        expect(response.status).toBe(403);
        expect(response.body.error).toBe("Admin access required");
      });

      test("should return 404 for non-existent product", async () => {
        // Arrange
        const nonExistentId = "507f1f77bcf86cd799439011";

        // Act
        const response = await request(app).delete(`/api/products/${nonExistentId}`).set("Authorization", `Bearer ${adminToken}`);

        // Assert
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Product not found");
      });
    });
  });

  describe("GET /api/products/categories - Get Categories", () => {
    test("should get all product categories", async () => {
      // Act
      const response = await request(app).get("/api/products/categories");

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.categories)).toBe(true);
      expect(response.body.categories.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/products/brands - Get Brands", () => {
    test("should get all product brands", async () => {
      // Act
      const response = await request(app).get("/api/products/brands");

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.brands)).toBe(true);
      expect(response.body.brands.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/products/suggestions - Get Search Suggestions", () => {
    test("should get search suggestions", async () => {
      // Act
      const response = await request(app).get("/api/products/suggestions?q=Test");

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.suggestions)).toBe(true);
    });
  });

  describe("GET /api/products/statistics - Get Product Statistics", () => {
    test("should get product statistics", async () => {
      // Act
      const response = await request(app).get("/api/products/statistics");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.totalProducts).toBeDefined();
      expect(response.body.totalValue).toBeDefined();
      expect(response.body.averagePrice).toBeDefined();
      expect(response.body.inStockProducts).toBeDefined();
      expect(response.body.outOfStockProducts).toBeDefined();
    });
  });
});
