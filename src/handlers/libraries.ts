import { Elysia, t } from "elysia";
import {
  createLibrarySchema,
  libraryQuerySchema,
  librarySchema,
  patchLibrarySchema,
} from "../models/index";
import { LibraryService } from "../services/LibraryService";

// Initialize services with repositories
import { LibraryRepository } from "../repositories/LibraryRepository";

const libraryRepository = new LibraryRepository();
const libraryService = new LibraryService(libraryRepository);

export const librariesHandler = new Elysia({
  prefix: "/libraries",
  detail: {
    tags: ["Libraries"],
    description: "Library management endpoints for the e-library system",
  },
})
  .post("/", async ({ body }) => libraryService.createLibrary(body), {
    body: createLibrarySchema,
    response: librarySchema,
    detail: {
      summary: "Create a new library",
      description: "Creates a new library branch in the system",
    },
  })
  .get(
    "/",
    async ({ query }) => {
      // If any query parameters are provided, use the filter endpoint
      return Object.keys(query).length > 0
        ? libraryService.getLibrariesByFilters(query)
        : libraryService.getAllLibraries();
    },
    {
      query: libraryQuerySchema,
      response: t.Array(librarySchema),
      detail: {
        summary: "Get all libraries",
        description:
          "Retrieves a list of all libraries in the system. Supports optional filtering by any library field.",
      },
    },
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const library = await libraryService.getLibraryById(id);
      if (!library) {
        throw new Error("Library not found");
      }
      return library;
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      response: librarySchema,
      detail: {
        summary: "Get library by ID",
        description: "Retrieves a specific library by its ID",
      },
    },
  )
  .patch(
    "/:id",
    async ({ params: { id }, body }) => {
      const library = await libraryService.updateLibrary(id, body);
      if (!library) {
        throw new Error("Library not found");
      }
      return library;
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      body: patchLibrarySchema,
      response: librarySchema,
      detail: {
        summary: "Update library",
        description: "Updates library information",
      },
    },
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      const deleted = await libraryService.deleteLibrary(id);
      if (!deleted) {
        throw new Error("Library not found");
      }
      return { success: true };
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      response: t.Object({ success: t.Boolean() }),
      detail: {
        summary: "Delete library",
        description: "Removes a library from the system",
      },
    },
  );
