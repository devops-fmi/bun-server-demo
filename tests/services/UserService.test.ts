import { describe, test, expect, beforeEach } from "bun:test";
import { UserService } from "../../src/services/UserService";
import { UserRepository } from "../../src/repositories/UserRepository";
import { CreateUserInput } from "../../src/models/index";

describe("UserService", () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    userRepository.clearAll();
    userService = new UserService(userRepository);
  });

  describe("createUser", () => {
    test("should create a new user through the service", async () => {
      const input: CreateUserInput = {
        name: "John Doe",
        email: "john@example.com",
        role: "admin",
      };

      const user = await userService.createUser(input);

      expect(user.id).toBeDefined();
      expect(user.name).toBe("John Doe");
      expect(user.email).toBe("john@example.com");
      expect(user.role).toBe("admin");
    });
  });

  describe("getUserById", () => {
    test("should retrieve a user by ID", async () => {
      const input: CreateUserInput = {
        name: "Jane Doe",
        email: "jane@example.com",
      };

      const createdUser = await userService.createUser(input);
      const retrievedUser = await userService.getUserById(createdUser.id);

      expect(retrievedUser).toBeDefined();
      expect(retrievedUser?.id).toBe(createdUser.id);
      expect(retrievedUser?.name).toBe("Jane Doe");
    });

    test("should return undefined for non-existent user", async () => {
      const user = await userService.getUserById("non-existent-id");
      expect(user).toBeUndefined();
    });
  });

  describe("getAllUsers", () => {
    test("should retrieve all users", async () => {
      const input1: CreateUserInput = {
        name: "User 1",
        email: "user1@example.com",
      };
      const input2: CreateUserInput = {
        name: "User 2",
        email: "user2@example.com",
      };

      await userService.createUser(input1);
      await userService.createUser(input2);

      const users = await userService.getAllUsers();

      expect(users).toHaveLength(2);
      expect(users.map((u) => u.name)).toEqual(["User 1", "User 2"]);
    });
  });

  describe("updateUser", () => {
    test("should update a user", async () => {
      const input: CreateUserInput = {
        name: "Original Name",
        email: "original@example.com",
      };

      const createdUser = await userService.createUser(input);
      const updated = await userService.updateUser(createdUser.id, {
        name: "Updated Name",
        role: "admin",
      });

      expect(updated?.name).toBe("Updated Name");
      expect(updated?.role).toBe("admin");
      expect(updated?.email).toBe("original@example.com");
    });

    test("should return undefined when updating non-existent user", async () => {
      const result = await userService.updateUser("non-existent-id", {
        name: "New Name",
      });

      expect(result).toBeUndefined();
    });
  });

  describe("deleteUser", () => {
    test("should delete a user", async () => {
      const input: CreateUserInput = {
        name: "User to Delete",
        email: "delete@example.com",
      };

      const createdUser = await userService.createUser(input);
      const deleted = await userService.deleteUser(createdUser.id);

      expect(deleted).toBe(true);

      const foundUser = await userService.getUserById(createdUser.id);
      expect(foundUser).toBeUndefined();
    });

    test("should return false when deleting non-existent user", async () => {
      const deleted = await userService.deleteUser("non-existent-id");
      expect(deleted).toBe(false);
    });
  });
});
