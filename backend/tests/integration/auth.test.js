/**
 * Authentication API Integration Tests
 * Following TDD methodology: Red -> Green -> Refactor
 *
 * Test Plan: User Authentication System
 * - Objective: Verify the correct behavior of user registration, login, and authentication processes
 * - Scope: User registration with validation, user login with authentication, JWT token generation and validation, role-based access control
 * - Strategy: API integration tests using Jest and Supertest with TDD approach
 */

const request = require("supertest");
const app = require("../../index");
const User = require("../../models/User");
const { validUsers, invalidUsers } = require("../fixtures/test-data");

describe("Authentication API", () => {
  describe("POST /api/auth/signup - User Registration", () => {
    describe("Positive Test Cases", () => {
      test("should register a new user with valid data", async () => {
        // Arrange
        const userData = validUsers[0];

        // Act
        const response = await request(app).post("/api/auth/signup").send(userData);

        // Assert
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User registered");
        expect(response.body.user).toBeDefined();
        expect(response.body.user.name).toBe(userData.name);
        expect(response.body.user.email).toBe(userData.email);
        expect(response.body.user.role).toBe(userData.role);
        expect(response.body.user.password).toBeUndefined();

        // Verify user was created in database
        const createdUser = await User.findOne({ email: userData.email });
        expect(createdUser).toBeDefined();
        expect(createdUser.name).toBe(userData.name);
      });

      test("should register a user with admin role", async () => {
        // Arrange
        const userData = validUsers[2]; // Admin user

        // Act
        const response = await request(app).post("/api/auth/signup").send(userData);

        // Assert
        expect(response.status).toBe(201);
        expect(response.body.user.role).toBe("admin");
      });

      test("should register a user with staff role", async () => {
        // Arrange
        const userData = validUsers[3]; // Staff user

        // Act
        const response = await request(app).post("/api/auth/signup").send(userData);

        // Assert
        expect(response.status).toBe(201);
        expect(response.body.user.role).toBe("staff");
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
        const response = await request(app).post("/api/auth/signup").send(userData);

        // Assert
        expect(response.status).toBe(201);
        expect(response.body.user.role).toBe("customer");
      });
    });

    describe("Negative Test Cases", () => {
      test("should fail to register user with empty name", async () => {
        // Arrange
        const userData = invalidUsers[0]; // Empty name

        // Act
        const response = await request(app).post("/api/auth/signup").send(userData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      test("should fail to register user with empty email", async () => {
        // Arrange
        const userData = invalidUsers[1]; // Empty email

        // Act
        const response = await request(app).post("/api/auth/signup").send(userData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      test("should fail to register user with empty password", async () => {
        // Arrange
        const userData = invalidUsers[2]; // Empty password

        // Act
        const response = await request(app).post("/api/auth/signup").send(userData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      test("should fail to register user with invalid email format", async () => {
        // Test multiple invalid email formats
        const invalidEmailUsers = [
          invalidUsers[6], // "invalid-email"
          invalidUsers[7], // "user@.com"
          invalidUsers[8], // "@example.com"
          invalidUsers[9], // "user@example"
        ];

        for (const userData of invalidEmailUsers) {
          const response = await request(app).post("/api/auth/signup").send(userData);
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        }
      });

      test("should fail to register user with invalid password format", async () => {
        // Test multiple invalid password formats
        const invalidPasswordUsers = [
          invalidUsers[10], // "password" (no uppercase, numbers, special chars)
          invalidUsers[11], // "Password" (no numbers, special chars)
          invalidUsers[12], // "password123" (no uppercase, special chars)
          invalidUsers[13], // "12345678" (no letters, special chars)
        ];

        for (const userData of invalidPasswordUsers) {
          const response = await request(app).post("/api/auth/signup").send(userData);
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        }
      });

      test("should fail to register user with duplicate email", async () => {
        // Arrange
        const userData = validUsers[0];
        await request(app).post("/api/auth/signup").send(userData); // First registration

        // Act
        const response = await request(app).post("/api/auth/signup").send(userData); // Duplicate

        // Assert
        expect(response.status).toBe(409);
        expect(response.body.error).toBe("Email already registered");
      });

      test("should fail to register user with invalid role", async () => {
        // Arrange
        const userData = invalidUsers[14]; // Invalid role

        // Act
        const response = await request(app).post("/api/auth/signup").send(userData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });
    });
  });

  describe("POST /api/auth/login - User Login", () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const userData = validUsers[0];
      await request(app).post("/api/auth/signup").send(userData);
    });

    describe("Positive Test Cases", () => {
      test("should login user with correct credentials", async () => {
        // Arrange
        const loginData = {
          email: validUsers[0].email,
          password: validUsers[0].password,
        };

        // Act
        const response = await request(app).post("/api/auth/login").send(loginData);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Login successful");
        expect(response.body.token).toBeDefined();
        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toBe(loginData.email);
        expect(response.body.user.password).toBeUndefined();
      });

      test("should return JWT token on successful login", async () => {
        // Arrange
        const loginData = {
          email: validUsers[0].email,
          password: validUsers[0].password,
        };

        // Act
        const response = await request(app).post("/api/auth/login").send(loginData);

        // Assert
        expect(response.body.token).toBeDefined();
        expect(typeof response.body.token).toBe("string");
        expect(response.body.token.length).toBeGreaterThan(0);
      });
    });

    describe("Negative Test Cases", () => {
      test("should fail to login with incorrect email", async () => {
        // Arrange
        const loginData = {
          email: "wrong@example.com",
          password: validUsers[0].password,
        };

        // Act
        const response = await request(app).post("/api/auth/login").send(loginData);

        // Assert
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Invalid credentials");
      });

      test("should fail to login with incorrect password", async () => {
        // Arrange
        const loginData = {
          email: validUsers[0].email,
          password: "wrongpassword",
        };

        // Act
        const response = await request(app).post("/api/auth/login").send(loginData);

        // Assert
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Invalid credentials");
      });

      test("should fail to login with empty email", async () => {
        // Arrange
        const loginData = {
          email: "",
          password: validUsers[0].password,
        };

        // Act
        const response = await request(app).post("/api/auth/login").send(loginData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("All fields are required");
      });

      test("should fail to login with empty password", async () => {
        // Arrange
        const loginData = {
          email: validUsers[0].email,
          password: "",
        };

        // Act
        const response = await request(app).post("/api/auth/login").send(loginData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("All fields are required");
      });

      test("should fail to login with non-existent user", async () => {
        // Arrange
        const loginData = {
          email: "nonexistent@example.com",
          password: "somepassword",
        };

        // Act
        const response = await request(app).post("/api/auth/login").send(loginData);

        // Assert
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Invalid credentials");
      });
    });
  });

  describe("GET /api/users/me - Get Current User", () => {
    let authToken;

    beforeEach(async () => {
      // Create a test user and get auth token
      const userData = validUsers[0];
      await request(app).post("/api/auth/signup").send(userData);

      const loginResponse = await request(app).post("/api/auth/login").send({
        email: userData.email,
        password: userData.password,
      });

      authToken = loginResponse.body.token;
    });

    describe("Positive Test Cases", () => {
      test("should return current user with valid token", async () => {
        // Act
        const response = await request(app).get("/api/users/me").set("Authorization", `Bearer ${authToken}`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.email).toBe(validUsers[0].email);
        expect(response.body.name).toBe(validUsers[0].name);
        expect(response.body.role).toBe(validUsers[0].role);
        expect(response.body.password).toBeUndefined();
      });
    });

    describe("Negative Test Cases", () => {
      test("should fail to get current user without token", async () => {
        // Act
        const response = await request(app).get("/api/users/me");

        // Assert
        expect(response.status).toBe(401);
        expect(response.body.error).toBeDefined();
      });

      test("should fail to get current user with invalid token", async () => {
        // Act
        const response = await request(app).get("/api/users/me").set("Authorization", "Bearer invalid-token");

        // Assert
        expect(response.status).toBe(401);
        expect(response.body.error).toBeDefined();
      });

      test("should fail to get current user with malformed token", async () => {
        // Act
        const response = await request(app).get("/api/users/me").set("Authorization", "InvalidFormat");

        // Assert
        expect(response.status).toBe(401);
        expect(response.body.error).toBeDefined();
      });
    });
  });

  describe("Role-Based Access Control", () => {
    let customerToken, adminToken, staffToken;

    beforeEach(async () => {
      // Create users with different roles
      const customerData = validUsers[0];
      const adminData = validUsers[2];
      const staffData = validUsers[3];

      await request(app).post("/api/auth/signup").send(customerData);
      await request(app).post("/api/auth/signup").send(adminData);
      await request(app).post("/api/auth/signup").send(staffData);

      // Get tokens for each role
      const customerLogin = await request(app).post("/api/auth/login").send({
        email: customerData.email,
        password: customerData.password,
      });
      customerToken = customerLogin.body.token;

      const adminLogin = await request(app).post("/api/auth/login").send({
        email: adminData.email,
        password: adminData.password,
      });
      adminToken = adminLogin.body.token;

      const staffLogin = await request(app).post("/api/auth/login").send({
        email: staffData.email,
        password: staffData.password,
      });
      staffToken = staffLogin.body.token;
    });

    test("should allow admin to access admin-only routes", async () => {
      // Act
      const response = await request(app).get("/api/users").set("Authorization", `Bearer ${adminToken}`);

      // Assert
      expect(response.status).toBe(200);
    });

    test("should deny customer access to admin-only routes", async () => {
      // Act
      const response = await request(app).get("/api/users").set("Authorization", `Bearer ${customerToken}`);

      // Assert
      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Admin access required");
    });

    test("should allow staff to access staff routes", async () => {
      // Act
      const response = await request(app).get("/api/orders").set("Authorization", `Bearer ${staffToken}`);

      // Assert
      expect(response.status).toBe(200);
    });

    test("should deny customer access to staff routes", async () => {
      // Act
      const response = await request(app).get("/api/orders").set("Authorization", `Bearer ${customerToken}`);

      // Assert
      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Staff or admin access required");
    });
  });
});
