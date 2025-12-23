import { Elysia, t } from "elysia";
import { createUserSchema, userSchema } from "../models/index";
import { UserService } from "../services/UserService";

// Initialize services with repositories
import { UserRepository } from "../repositories/UserRepository";
import { patchUserSchema } from "../models/user";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const usersHandler = new Elysia({
  prefix: "/users",
  detail: {
    tags: ["Users"],
    description: "User management endpoints for the e-library",
  },
})
  .post("/", async ({ body }) => userService.createUser(body), {
    body: createUserSchema,
    response: userSchema,
    detail: {
      summary: "Create a new user",
      description: "Creates a new user account for the e-library",
    },
  })
  .get("/", async () => userService.getAllUsers(), {
    response: t.Array(userSchema),
    detail: {
      summary: "Get all users",
      description: "Retrieves a list of all registered users",
    },
  })
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const user = await userService.getUserById(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      response: userSchema,
      detail: {
        summary: "Get user by ID",
        description: "Retrieves a specific user by their ID",
      },
    }
  )
  .patch(
    "/:id",
    async ({ params: { id }, body }) => {
      const user = await userService.updateUser(id, body);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      body: patchUserSchema,
      response: userSchema,
      detail: {
        summary: "Update user",
        description: "Updates an existing user with partial data",
      },
    }
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      const deleted = await userService.deleteUser(id);
      if (!deleted) {
        throw new Error("User not found");
      }
      return { success: true };
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      response: t.Object({ success: t.Boolean() }),
      detail: {
        summary: "Delete user",
        description: "Deletes a user account",
      },
    }
  );
