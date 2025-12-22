import { Elysia, t } from "elysia";
import { createUserSchema, patchUserSchema, userSchema } from "../models/user";
import { UserService } from "../services/user.service";

export const usersHandler = new Elysia({
  prefix: "/users",
  detail: {
    tags: ["Users"],
    description: "User management endpoints",
  },
})
  .post("/", ({ body }) => UserService.create(body), {
    body: createUserSchema,
    response: {
      201: userSchema,
    },
    detail: {
      summary: "Create a new user",
      description: "Creates a new user with the provided details",
    },
  })
  .get("/", () => UserService.getAll(), {
    response: t.Array(userSchema),
    detail: {
      summary: "Get all users",
      description: "Retrieves a list of all users",
    },
  })
  .get(
    "/:id",
    ({ params: { id } }) => {
      const user = UserService.getById(id);
      if (!user) {
        return new Response("User not found", { status: 404 });
      }
      return user;
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      response: {
        200: userSchema,
        404: t.Object({ message: t.String() }),
      },
      detail: {
        summary: "Get user by ID",
        description: "Retrieves a specific user by their ID",
      },
    },
  )
  .patch(
    "/:id",
    ({ params: { id }, body }) => {
      const user = UserService.update(id, body);
      if (!user) {
        return new Response("User not found", { status: 404 });
      }
      return user;
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      body: patchUserSchema,
      response: {
        200: userSchema,
        404: t.Object({ message: t.String() }),
      },
      detail: {
        summary: "Update user",
        description: "Updates an existing user with partial data",
      },
    },
  )
  .delete(
    "/:id",
    ({ params: { id } }) => {
      const deleted = UserService.delete(id);
      if (!deleted) {
        return new Response("User not found", { status: 404 });
      }
      return { success: true, id };
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      response: {
        200: t.Object({ success: t.Boolean(), id: t.String() }),
        404: t.Object({ message: t.String() }),
      },
      detail: {
        summary: "Delete user",
        description: "Deletes a user by their ID",
      },
    },
  );
