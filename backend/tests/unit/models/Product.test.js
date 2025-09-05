/**
 * Product Model Unit Tests
 * Following TDD methodology: Red -> Green -> Refactor
 *
 * Test Plan: Product Management and Validation
 * - Objective: Verify the correct behavior of the Product model during CRUD operations
 * - Scope: Validation of product data (name, description, price, category, brand, stock)
 * - Strategy: Unit tests using Jest with TDD approach
 */

const mongoose = require("mongoose");
const Product = require("../../../models/Product");
const { validProducts, invalidProducts } = require("../../fixtures/test-data");

describe("Product Model", () => {
  describe("Product Creation - Positive Test Cases", () => {
    test("should create a product with valid data", async () => {
      // Arrange
      const productData = validProducts[0];

      // Act
      const product = new Product(productData);
      const savedProduct = await product.save();

      // Assert
      expect(savedProduct._id).toBeDefined();
      expect(savedProduct.name).toBe(productData.name);
      expect(savedProduct.description).toBe(productData.description);
      expect(savedProduct.price).toBe(productData.price);
      expect(savedProduct.category).toBe(productData.category);
      expect(savedProduct.brand).toBe(productData.brand);
      expect(savedProduct.stock).toBe(productData.stock);
      expect(savedProduct.tags).toEqual(productData.tags);
      expect(savedProduct.sku).toBe(productData.sku);
      expect(savedProduct.createdAt).toBeDefined();
    });

    test("should create a product with all optional fields", async () => {
      // Arrange
      const productData = validProducts[0]; // Includes weight and dimensions

      // Act
      const product = new Product(productData);
      const savedProduct = await product.save();

      // Assert
      expect(savedProduct.weight).toBe(productData.weight);
      expect(savedProduct.dimensions).toEqual(productData.dimensions);
      expect(savedProduct.isActive).toBe(true); // Default value
    });

    test("should set default values correctly", async () => {
      // Arrange
      const productData = {
        name: "Test Product",
        description: "Test description",
        price: 99.99,
        category: "Test Category",
        brand: "Test Brand",
        stock: 10,
        tags: ["test"],
        sku: "TEST-001",
      };

      // Act
      const product = new Product(productData);
      const savedProduct = await product.save();

      // Assert
      expect(savedProduct.isActive).toBe(true);
      expect(savedProduct.images).toEqual([]);
      expect(savedProduct.ratings).toEqual({ average: 0, count: 0 });
    });

    test("should set createdAt and updatedAt timestamps automatically", async () => {
      // Arrange
      const productData = validProducts[0];
      const beforeCreation = new Date();

      // Act
      const product = new Product(productData);
      const savedProduct = await product.save();
      const afterCreation = new Date();

      // Assert
      expect(savedProduct.createdAt).toBeDefined();
      expect(savedProduct.updatedAt).toBeDefined();
      expect(savedProduct.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(savedProduct.createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });
  });

  describe("Product Creation - Negative Test Cases", () => {
    test("should fail to create product with missing name", async () => {
      // Arrange
      const productData = invalidProducts[0]; // Missing name

      // Act & Assert
      const product = new Product(productData);
      await expect(product.save()).rejects.toThrow();
    });

    test("should fail to create product with missing description", async () => {
      // Arrange
      const productData = invalidProducts[1]; // Missing description

      // Act & Assert
      const product = new Product(productData);
      await expect(product.save()).rejects.toThrow();
    });

    test("should fail to create product with missing price", async () => {
      // Arrange
      const productData = invalidProducts[2]; // Missing price

      // Act & Assert
      const product = new Product(productData);
      await expect(product.save()).rejects.toThrow();
    });

    test("should fail to create product with invalid price type", async () => {
      // Arrange
      const productData = invalidProducts[3]; // Invalid price type

      // Act & Assert
      const product = new Product(productData);
      await expect(product.save()).rejects.toThrow();
    });

    test("should fail to create product with invalid stock type", async () => {
      // Arrange
      const productData = invalidProducts[4]; // Invalid stock type

      // Act & Assert
      const product = new Product(productData);
      await expect(product.save()).rejects.toThrow();
    });

    test("should fail to create product with negative price", async () => {
      // Arrange
      const productData = invalidProducts[5]; // Negative price

      // Act & Assert
      const product = new Product(productData);
      await expect(product.save()).rejects.toThrow();
    });

    test("should fail to create product with negative stock", async () => {
      // Arrange
      const productData = invalidProducts[6]; // Negative stock

      // Act & Assert
      const product = new Product(productData);
      await expect(product.save()).rejects.toThrow();
    });

    test("should fail to create product with empty name", async () => {
      // Arrange
      const productData = invalidProducts[7]; // Empty name

      // Act & Assert
      const product = new Product(productData);
      await expect(product.save()).rejects.toThrow();
    });

    test("should fail to create product with empty description", async () => {
      // Arrange
      const productData = invalidProducts[8]; // Empty description

      // Act & Assert
      const product = new Product(productData);
      await expect(product.save()).rejects.toThrow();
    });
  });

  describe("Product Model Methods", () => {
    test("should update stock correctly", async () => {
      // Arrange
      const productData = validProducts[0];
      const product = new Product(productData);
      const savedProduct = await product.save();

      // Act
      savedProduct.stock = 25;
      const updatedProduct = await savedProduct.save();

      // Assert
      expect(updatedProduct.stock).toBe(25);
      expect(updatedProduct.updatedAt.getTime()).toBeGreaterThan(savedProduct.updatedAt.getTime());
    });

    test("should toggle active status correctly", async () => {
      // Arrange
      const productData = validProducts[0];
      const product = new Product(productData);
      const savedProduct = await product.save();

      // Act
      savedProduct.isActive = false;
      const updatedProduct = await savedProduct.save();

      // Assert
      expect(updatedProduct.isActive).toBe(false);
    });

    test("should add and remove tags correctly", async () => {
      // Arrange
      const productData = validProducts[0];
      const product = new Product(productData);
      const savedProduct = await product.save();

      // Act - Add tag
      savedProduct.tags.push("new-tag");
      const updatedProduct = await savedProduct.save();

      // Assert
      expect(updatedProduct.tags).toContain("new-tag");
      expect(updatedProduct.tags.length).toBe(productData.tags.length + 1);
    });
  });

  describe("Product Model Schema Validation", () => {
    test("should validate required fields", () => {
      // Arrange
      const product = new Product();

      // Act
      const validationError = product.validateSync();

      // Assert
      expect(validationError).toBeDefined();
      expect(validationError.errors.name).toBeDefined();
      expect(validationError.errors.description).toBeDefined();
      expect(validationError.errors.price).toBeDefined();
      expect(validationError.errors.category).toBeDefined();
      expect(validationError.errors.brand).toBeDefined();
      expect(validationError.errors.stock).toBeDefined();
    });

    test("should validate price is positive", () => {
      // Arrange
      const product = new Product({
        name: "Test Product",
        description: "Test description",
        price: -100,
        category: "Test Category",
        brand: "Test Brand",
        stock: 10,
        tags: ["test"],
        sku: "TEST-001",
      });

      // Act
      const validationError = product.validateSync();

      // Assert
      expect(validationError).toBeDefined();
      expect(validationError.errors.price).toBeDefined();
    });

    test("should validate stock is non-negative", () => {
      // Arrange
      const product = new Product({
        name: "Test Product",
        description: "Test description",
        price: 100,
        category: "Test Category",
        brand: "Test Brand",
        stock: -10,
        tags: ["test"],
        sku: "TEST-001",
      });

      // Act
      const validationError = product.validateSync();

      // Assert
      expect(validationError).toBeDefined();
      expect(validationError.errors.stock).toBeDefined();
    });

    test("should validate rating range", () => {
      // Arrange
      const product = new Product({
        name: "Test Product",
        description: "Test description",
        price: 100,
        category: "Test Category",
        brand: "Test Brand",
        stock: 10,
        tags: ["test"],
        sku: "TEST-001",
        ratings: { average: 6, count: 1 }, // Invalid rating > 5
      });

      // Act
      const validationError = product.validateSync();

      // Assert
      expect(validationError).toBeDefined();
      expect(validationError.errors["ratings.average"]).toBeDefined();
    });
  });

  describe("Product Model Virtual Fields", () => {
    test("should calculate total value correctly", async () => {
      // Arrange
      const productData = validProducts[0];
      const product = new Product(productData);
      const savedProduct = await product.save();

      // Act
      const totalValue = savedProduct.price * savedProduct.stock;

      // Assert
      expect(totalValue).toBe(productData.price * productData.stock);
    });

    test("should return formatted price", async () => {
      // Arrange
      const productData = validProducts[0];
      const product = new Product(productData);
      const savedProduct = await product.save();

      // Act
      const formattedPrice = `$${savedProduct.price.toFixed(2)}`;

      // Assert
      expect(formattedPrice).toBe(`$${productData.price.toFixed(2)}`);
    });
  });
});
