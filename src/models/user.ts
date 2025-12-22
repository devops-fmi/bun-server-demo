import { t } from "elysia";

export const createUserSchema = t.Object({
  name: t.String({ minLength: 1 }),
  email: t.String({ format: "email" }),
  age: t.Optional(t.Number({ minimum: 0 })),
});

export const patchUserSchema = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  email: t.Optional(t.String({ format: "email" })),
  age: t.Optional(t.Number({ minimum: 0 })),
});

export const userSchema = t.Object({
  id: t.String({ format: "uuid" }),
  name: t.String({ minLength: 1 }),
  email: t.String({ format: "email" }),
  age: t.Optional(t.Number({ minimum: 0 })),
  createdAt: t.Date(),
});

export type CreateUserInput = typeof createUserSchema.static;
export type User = typeof userSchema.static;
