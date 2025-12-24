import { t } from "elysia";

export const createBookSchema = t.Object({
  title: t.String({ minLength: 1 }),
  author: t.String({ minLength: 1 }),
  isbn: t.String(),
  genre: t.Union([
    t.Literal("fiction"),
    t.Literal("non-fiction"),
    t.Literal("mystery"),
    t.Literal("romance"),
    t.Literal("sci-fi"),
    t.Literal("fantasy"),
    t.Literal("biography"),
    t.Literal("history"),
    t.Literal("self-help"),
    t.Literal("technology"),
  ]),
  publishedYear: t.Number({ minimum: 1000, maximum: new Date().getFullYear() }),
  quantity: t.Number({ minimum: 0 }),
});

export const patchBookSchema = t.Object({
  title: t.Optional(t.String({ minLength: 1 })),
  author: t.Optional(t.String({ minLength: 1 })),
  isbn: t.Optional(t.String()),
  genre: t.Optional(
    t.Union([
      t.Literal("fiction"),
      t.Literal("non-fiction"),
      t.Literal("mystery"),
      t.Literal("romance"),
      t.Literal("sci-fi"),
      t.Literal("fantasy"),
      t.Literal("biography"),
      t.Literal("history"),
      t.Literal("self-help"),
      t.Literal("technology"),
    ]),
  ),
  publishedYear: t.Optional(
    t.Number({ minimum: 1000, maximum: new Date().getFullYear() }),
  ),
  quantity: t.Optional(t.Number({ minimum: 0 })),
});

export const bookSchema = t.Object({
  id: t.String({ format: "uuid" }),
  title: t.String({ minLength: 1 }),
  author: t.String({ minLength: 1 }),
  isbn: t.String(),
  genre: t.Union([
    t.Literal("fiction"),
    t.Literal("non-fiction"),
    t.Literal("mystery"),
    t.Literal("romance"),
    t.Literal("sci-fi"),
    t.Literal("fantasy"),
    t.Literal("biography"),
    t.Literal("history"),
    t.Literal("self-help"),
    t.Literal("technology"),
  ]),
  publishedYear: t.Number({ minimum: 1000, maximum: new Date().getFullYear() }),
  quantity: t.Number({ minimum: 0 }),
  createdAt: t.Date(),
});

export type CreateBookInput = typeof createBookSchema.static;
export type PatchBookInput = typeof patchBookSchema.static;
export type Book = typeof bookSchema.static;
