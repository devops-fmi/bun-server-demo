import { Elysia, t } from "elysia";
import { bookSchema, createBookSchema, patchBookSchema } from "../models/index";
import { BookService } from "../services/BookService";

// Initialize services with repositories
import { BookRepository } from "../repositories/BookRepository";

const bookRepository = new BookRepository();
const bookService = new BookService(bookRepository);

export const booksHandler = new Elysia({
  prefix: "/books",
  detail: {
    tags: ["Books"],
    description: "Book management endpoints for the e-library",
  },
})
  .post("/", async ({ body }) => bookService.createBook(body), {
    body: createBookSchema,
    response: bookSchema,
    detail: {
      summary: "Add a new book",
      description: "Adds a new book to the e-library catalog",
    },
  })
  .get(
    "/",
    async ({ query: { genre } }) => {
      if (genre) {
        return bookService.getBooksByGenre(genre as string);
      }
      return bookService.getAllBooks();
    },
    {
      query: t.Object({ genre: t.Optional(t.String()) }),
      response: t.Array(bookSchema),
      detail: {
        summary: "Get all books",
        description: "Retrieves all books or filters by genre",
      },
    },
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const book = await bookService.getBookById(id);
      if (!book) {
        throw new Error("Book not found");
      }
      return book;
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      response: bookSchema,
      detail: {
        summary: "Get book by ID",
        description: "Retrieves a specific book by its ID",
      },
    },
  )
  .patch(
    "/:id",
    async ({ params: { id }, body }) => {
      const book = await bookService.updateBook(id, body);
      if (!book) {
        throw new Error("Book not found");
      }
      return book;
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      body: patchBookSchema,
      response: bookSchema,
      detail: {
        summary: "Update book",
        description: "Updates a book in the catalog",
      },
    },
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      const deleted = await bookService.deleteBook(id);
      if (!deleted) {
        throw new Error("Book not found");
      }
      return { success: true };
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      response: t.Object({ success: t.Boolean() }),
      detail: {
        summary: "Delete book",
        description: "Removes a book from the catalog",
      },
    },
  );
