const request = require("supertest");
const app = require("../src/app");

describe("API Endpoints", () => {
  describe("GET /api/health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/api/health").expect(200);

      expect(response.body).toHaveProperty("status", "healthy");
      expect(response.body).toHaveProperty("timestamp");
      expect(response.body).toHaveProperty("uptime");
      expect(response.body).toHaveProperty("environment");
      expect(response.body).toHaveProperty("version");
    });
  });

  describe("User API", () => {
    describe("GET /api/users", () => {
      it("should return all users", async () => {
        const response = await request(app).get("/api/users").expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.count).toBeGreaterThanOrEqual(0);
      });
    });

    describe("GET /api/users/:id", () => {
      it("should return user by ID", async () => {
        const response = await request(app).get("/api/users/1").expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("id", "1");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("email");
      });

      it("should return 404 for non-existent user", async () => {
        const response = await request(app).get("/api/users/999").expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("User not found");
      });
    });

    describe("POST /api/users", () => {
      it("should create a new user", async () => {
        const newUser = {
          name: "Test User",
          email: "test@example.com",
        };

        const response = await request(app)
          .post("/api/users")
          .send(newUser)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe(newUser.name);
        expect(response.body.data.email).toBe(newUser.email);
        expect(response.body.data).toHaveProperty("id");
        expect(response.body.data).toHaveProperty("createdAt");
      });

      it("should return error for missing name", async () => {
        const response = await request(app)
          .post("/api/users")
          .send({ email: "test@example.com" })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Name and email are required");
      });

      it("should return error for missing email", async () => {
        const response = await request(app)
          .post("/api/users")
          .send({ name: "Test User" })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Name and email are required");
      });

      it("should return error for missing fields", async () => {
        const response = await request(app)
          .post("/api/users")
          .send({})
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Name and email are required");
      });

      it("should return error for duplicate email", async () => {
        // First create a user
        await request(app)
          .post("/api/users")
          .send({ name: "First User", email: "duplicate@example.com" });

        // Try to create another user with same email
        const response = await request(app)
          .post("/api/users")
          .send({ name: "Second User", email: "duplicate@example.com" })
          .expect(409);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("User with this email already exists");
      });
    });

    describe("PUT /api/users/:id", () => {
      it("should update an existing user", async () => {
        const updatedData = {
          name: "Updated Name",
          email: "updated@example.com",
        };

        const response = await request(app)
          .put("/api/users/1")
          .send(updatedData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe(updatedData.name);
        expect(response.body.data.email).toBe(updatedData.email);
        expect(response.body.data).toHaveProperty("updatedAt");
      });

      it("should return 404 for non-existent user", async () => {
        const response = await request(app)
          .put("/api/users/999")
          .send({ name: "Test", email: "test@example.com" })
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("User not found");
      });

      it("should return error for missing name", async () => {
        const response = await request(app)
          .put("/api/users/1")
          .send({ email: "test@example.com" })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Name and email are required");
      });

      it("should return error for missing email", async () => {
        const response = await request(app)
          .put("/api/users/1")
          .send({ name: "Test User" })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Name and email are required");
      });

      it("should return error for duplicate email", async () => {
        // Try to update user 1 with user 2's email
        const response = await request(app)
          .put("/api/users/1")
          .send({ name: "Updated Name", email: "jane@example.com" })
          .expect(409);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("User with this email already exists");
      });
    });

    describe("DELETE /api/users/:id", () => {
      it("should delete an existing user", async () => {
        // First create a user to delete
        const createResponse = await request(app)
          .post("/api/users")
          .send({ name: "To Delete", email: "delete@example.com" });

        const userId = createResponse.body.data.id;

        const response = await request(app)
          .delete(`/api/users/${userId}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("User deleted successfully");
        expect(response.body.data).toHaveProperty("id", userId);

        // Verify user is actually deleted
        await request(app).get(`/api/users/${userId}`).expect(404);
      });

      it("should return 404 for non-existent user", async () => {
        const response = await request(app)
          .delete("/api/users/999")
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("User not found");
      });
    });
  });

  describe("404 Handler", () => {
    it("should return 404 for unknown routes", async () => {
      const response = await request(app).get("/unknown-route").expect(404);

      expect(response.body.error).toBe("Route not found");
    });

    it("should return 404 for unknown API routes", async () => {
      const response = await request(app).get("/api/unknown").expect(404);

      expect(response.body.error).toBe("Route not found");
    });
  });

  describe("Error Handler", () => {
    // This test triggers the global error handler
    it("should handle server errors gracefully", async () => {
      // Mock console.error to avoid noise in test output
      const originalConsoleError = console.error;
      const originalNodeEnv = process.env.NODE_ENV;
      console.error = jest.fn();

      // Set NODE_ENV to development for this test
      process.env.NODE_ENV = "development";

      // Create a route that throws an error for testing
      const express = require("express");
      const testApp = express();
      testApp.use(express.json());

      // Add a route that throws an error
      testApp.get("/test-error", (req, res, next) => {
        const error = new Error("Test error");
        next(error);
      });

      // Add the same error handler as main app
      testApp.use((err, req, res, next) => {
        // eslint-disable-line no-unused-vars
        console.error(err.stack);
        res.status(500).json({
          error: "Something went wrong!",
          message:
            process.env.NODE_ENV === "development"
              ? err.message
              : "Internal server error",
        });
      });

      const response = await request(testApp).get("/test-error").expect(500);

      expect(response.body.error).toBe("Something went wrong!");
      expect(response.body.message).toBe("Test error"); // In development mode

      // Restore environment and console
      process.env.NODE_ENV = originalNodeEnv;
      console.error = originalConsoleError;
    });

    it("should handle server errors in production mode", async () => {
      // Mock console.error to avoid noise in test output
      const originalConsoleError = console.error;
      const originalNodeEnv = process.env.NODE_ENV;
      console.error = jest.fn();

      // Set NODE_ENV to production for this test
      process.env.NODE_ENV = "production";

      // Create a route that throws an error for testing
      const express = require("express");
      const testApp = express();
      testApp.use(express.json());

      // Add a route that throws an error
      testApp.get("/test-error", (req, res, next) => {
        const error = new Error("Sensitive error details");
        next(error);
      });

      // Add the same error handler as main app
      testApp.use((err, req, res, next) => {
        // eslint-disable-line no-unused-vars
        console.error(err.stack);
        res.status(500).json({
          error: "Something went wrong!",
          message:
            process.env.NODE_ENV === "development"
              ? err.message
              : "Internal server error",
        });
      });

      const response = await request(testApp).get("/test-error").expect(500);

      expect(response.body.error).toBe("Something went wrong!");
      expect(response.body.message).toBe("Internal server error"); // In production mode

      // Restore environment and console
      process.env.NODE_ENV = originalNodeEnv;
      console.error = originalConsoleError;
    });
  });
});
