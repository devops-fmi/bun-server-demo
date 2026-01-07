import { t } from "elysia";

export const createLibrarySchema = t.Object({
  name: t.String({ minLength: 1 }),
  location: t.String({ minLength: 1 }),
  manager: t.String({ format: "uuid" }),
});

export const patchLibrarySchema = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  location: t.Optional(t.String({ minLength: 1 })),
  manager: t.Optional(t.String({ format: "uuid" })),
  totalBooks: t.Optional(t.Number({ minimum: 0 })),
});

export const librarySchema = t.Object({
  id: t.String({ format: "uuid" }),
  name: t.String({ minLength: 1 }),
  location: t.String({ minLength: 1 }),
  manager: t.String({ format: "uuid" }),
  totalBooks: t.Number({ minimum: 0 }),
  createdAt: t.Date(),
});

export const libraryQuerySchema = t.Object({
  name: t.Optional(t.String()),
  location: t.Optional(t.String()),
  manager: t.Optional(t.String({ format: "uuid" })),
  totalBooks: t.Optional(t.Number({ minimum: 0 })),
});

export type CreateLibraryInput = typeof createLibrarySchema.static;
export type PatchLibraryInput = typeof patchLibrarySchema.static;
export type LibraryQueryInput = typeof libraryQuerySchema.static;

export type Library = typeof librarySchema.static;
