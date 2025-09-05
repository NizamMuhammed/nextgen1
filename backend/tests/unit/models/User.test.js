/**
 * User Model Unit Tests
 * Following TDD methodology: Red -> Green -> Refactor
 *
 * Test Plan: User Registration and Validation
 * - Objective: Verify the correct behavior of the User model during registration
 * - Scope: Validation of user data (name, email, password, role)
 * - Strategy: Unit tests using Jest with TDD approach
 */

const mongoose = require("mongoose");
const User = require("../../../models/User");
const { validUsers, invalidUsers } = require("../../fixtures/test-data");

describe("User Model", () => {
  describe("User Creation - Positive Test Cases", () => {
    test("should create a user with valid data", async () => {
      // Arrange
      const userData = validUsers[0];

      // Act
      const user = new User(userData);
      const savedUser = await user.save();

      // Assert
      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.role).toBe(userData.role);
      expect(savedUser.password).not.toBe(userData.password); // Should be hashed
      expect(savedUser.createdAt).toBeDefined();
    });

    test("should create a user with admin role", async () => {
      // Arrange
      const userData = validUsers[2]; // Admin user

      // Act
      const user = new User(userData);
      const savedUser = await user.save();

      // Assert
      expect(savedUser.role).toBe("admin");
      expect(savedUser.email).toBe("admin@nextgen.com");
    });

    test("should create a user with staff role", async () => {
      // Arrange
      const userData = validUsers[3]; // Staff user

      // Act
      const user = new User(userData);
      const savedUser = await user.save();

      // Assert
      expect(savedUser.role).toBe("staff");
      expect(savedUser.email).toBe("staff@nextgen.com");
    });

    test("should default role to customer when not specified", async () => {
      // Arrange
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "TestPass123!",
        // No role specified
      };

      // Act
      const user = new User(userData);
      const savedUser = await user.save();

      // Assert
      expect(savedUser.role).toBe("customer");
    });

    test("should set createdAt timestamp automatically", async () => {
      // Arrange
      const userData = validUsers[0];
      const beforeCreation = new Date();

      // Act
      const user = new User(userData);
      const savedUser = await user.save();
      const afterCreation = new Date();

      // Assert
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(savedUser.createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });
  });

  describe("User Creation - Negative Test Cases", () => {
    test("should fail to create user with empty name", async () => {
      // Arrange
      const userData = invalidUsers[0]; // Empty name

      // Act & Assert
      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    test("should fail to create user with empty email", async () => {
      // Arrange
      const userData = invalidUsers[1]; // Empty email

      // Act & Assert
      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    test("should fail to create user with empty password", async () => {
      // Arrange
      const userData = invalidUsers[2]; // Empty password

      // Act & Assert
      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    test("should fail to create user with null name", async () => {
      // Arrange
      const userData = invalidUsers[3]; // Null name

      // Act & Assert
      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    test("should fail to create user with null email", async () => {
      // Arrange
      const userData = invalidUsers[4]; // Null email

      // Act & Assert
      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    test("should fail to create user with null password", async () => {
      // Arrange
      const userData = invalidUsers[5]; // Null password

      // Act & Assert
      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    test("should fail to create user with invalid email format", async () => {
      // Test multiple invalid email formats
      const invalidEmails = [
        invalidUsers[6], // "invalid-email"
        invalidUsers[7], // "user@.com"
        invalidUsers[8], // "@example.com"
        invalidUsers[9], // "user@example"
      ];

      for (const userData of invalidEmails) {
        const user = new User(userData);
        await expect(user.save()).rejects.toThrow();
      }
    });

    test("should fail to create user with invalid password format", async () => {
      // Test multiple invalid password formats
      const invalidPasswords = [
        invalidUsers[10], // "password" (no uppercase, numbers, special chars)
        invalidUsers[11], // "Password" (no numbers, special chars)
        invalidUsers[12], // "password123" (no uppercase, special chars)
        invalidUsers[13], // "12345678" (no letters, special chars)
      ];

      for (const userData of invalidPasswords) {
        const user = new User(userData);
        await expect(user.save()).rejects.toThrow();
      }
    });

    test("should fail to create user with invalid role", async () => {
      // Arrange
      const userData = invalidUsers[14]; // Invalid role

      // Act & Assert
      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    test("should fail to create user with empty role", async () => {
      // Arrange
      const userData = invalidUsers[15]; // Empty role

      // Act & Assert
      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });
  });

  describe("User Validation - Email Uniqueness", () => {
    test("should fail to create user with duplicate email", async () => {
      // Arrange
      const userData = validUsers[0];
      const firstUser = new User(userData);
      await firstUser.save();

      // Act & Assert
      const duplicateUser = new User(userData);
      await expect(duplicateUser.save()).rejects.toThrow();
    });

    test("should allow different users with different emails", async () => {
      // Arrange
      const user1Data = validUsers[0];
      const user2Data = validUsers[1];

      // Act
      const user1 = new User(user1Data);
      const user2 = new User(user2Data);
      const savedUser1 = await user1.save();
      const savedUser2 = await user2.save();

      // Assert
      expect(savedUser1.email).not.toBe(savedUser2.email);
      expect(savedUser1._id).not.toEqual(savedUser2._id);
    });
  });

  describe("User Model Methods", () => {
    test("should compare password correctly", async () => {
      // Arrange
      const userData = validUsers[0];
      const user = new User(userData);
      await user.save();

      // Act & Assert
      const isMatch = await user.comparePassword(userData.password);
      expect(isMatch).toBe(true);

      const isNotMatch = await user.comparePassword("wrongpassword");
      expect(isNotMatch).toBe(false);
    });

    test("should return user without password in toJSON", async () => {
      // Arrange
      const userData = validUsers[0];
      const user = new User(userData);
      const savedUser = await user.save();

      // Act
      const userJSON = savedUser.toJSON();

      // Assert
      expect(userJSON.password).toBeUndefined();
      expect(userJSON.name).toBe(userData.name);
      expect(userJSON.email).toBe(userData.email);
      expect(userJSON.role).toBe(userData.role);
    });
  });

  describe("User Model Schema Validation", () => {
    test("should validate required fields", () => {
      // Arrange
      const user = new User();

      // Act
      const validationError = user.validateSync();

      // Assert
      expect(validationError).toBeDefined();
      expect(validationError.errors.name).toBeDefined();
      expect(validationError.errors.email).toBeDefined();
      expect(validationError.errors.password).toBeDefined();
    });

    test("should validate email format", () => {
      // Arrange
      const user = new User({
        name: "Test User",
        email: "invalid-email",
        password: "ValidPass123!",
      });

      // Act
      const validationError = user.validateSync();

      // Assert
      expect(validationError).toBeDefined();
      expect(validationError.errors.email).toBeDefined();
    });

    test("should validate role enum values", () => {
      // Arrange
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "ValidPass123!",
        role: "invalid_role",
      });

      // Act
      const validationError = user.validateSync();

      // Assert
      expect(validationError).toBeDefined();
      expect(validationError.errors.role).toBeDefined();
    });
  });
});
