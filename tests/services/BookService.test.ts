import { describe, test, expect, beforeEach } from "bun:test";
import { BookService } from "../../src/services/BookService";
import { BookRepository } from "../../src/repositories/BookRepository";
import { CreateBookInput } from "../../src/models/index";

describe("BookService", () => {
  let bookService: BookService;
  let bookRepository: BookRepository;

  beforeEach(() => {
    bookRepository = new BookRepository();
    bookService = new BookService(bookRepository);
  });

  describe("createBook", () => {
    test("should create a new book through the service", async () => {
      const input: CreateBookInput = {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "978-0743273565",
        genre: "fiction",
        publishedYear: 1925,
        quantity: 10,
      };

      const book = await bookService.createBook(input);

      expect(book.id).toBeDefined();
      expect(book.title).toBe("The Great Gatsby");
      expect(book.genre).toBe("fiction");
    });
  });

  describe("getBookById", () => {
    test("should retrieve a book by ID", async () => {
      const input: CreateBookInput = {
        title: "Test Book",
        author: "Test Author",
        isbn: "ISBN123",
        genre: "mystery",
        publishedYear: 2020,
        quantity: 5,
      };

      const createdBook = await bookService.createBook(input);
      const retrievedBook = await bookService.getBookById(createdBook.id);

      expect(retrievedBook).toBeDefined();
      expect(retrievedBook?.id).toBe(createdBook.id);
      expect(retrievedBook?.title).toBe("Test Book");
    });

    test("should return undefined for non-existent book", async () => {
      const book = await bookService.getBookById("non-existent-id");
      expect(book).toBeUndefined();
    });
  });

  describe("getAllBooks", () => {
    test("should retrieve all books", async () => {
      const input1: CreateBookInput = {
        title: "Book 1",
        author: "Author 1",
        isbn: "ISBN1",
        genre: "fiction",
        publishedYear: 2020,
        quantity: 1,
      };
      const input2: CreateBookInput = {
        title: "Book 2",
        author: "Author 2",
        isbn: "ISBN2",
        genre: "non-fiction",
        publishedYear: 2021,
        quantity: 2,
      };

      await bookService.createBook(input1);
      await bookService.createBook(input2);

      const books = await bookService.getAllBooks();

      expect(books).toHaveLength(2);
    });
  });

  describe("getBooksByGenre", () => {
    test("should filter books by genre", async () => {
      const fictionBook: CreateBookInput = {
        title: "Fiction Book",
        author: "Author",
        isbn: "ISBN1",
        genre: "fiction",
        publishedYear: 2020,
        quantity: 1,
      };
      const romanceBook: CreateBookInput = {
        title: "Romance Book",
        author: "Author",
        isbn: "ISBN2",
        genre: "romance",
        publishedYear: 2021,
        quantity: 1,
      };

      await bookService.createBook(fictionBook);
      await bookService.createBook(romanceBook);

      const fictionBooks = await bookService.getBooksByGenre("fiction");

      expect(fictionBooks).toHaveLength(1);
      expect(fictionBooks[0].title).toBe("Fiction Book");
    });

    test("should return empty array when no books match genre", async () => {
      const books = await bookService.getBooksByGenre("sci-fi");
      expect(books).toEqual([]);
    });
  });

  describe("updateBook", () => {
    test("should update a book", async () => {
      const input: CreateBookInput = {
        title: "Original Title",
        author: "Original Author",
        isbn: "ISBN123",
        genre: "fiction",
        publishedYear: 2020,
        quantity: 5,
      };

      const createdBook = await bookService.createBook(input);
      const updated = await bookService.updateBook(createdBook.id, {
        quantity: 20,
        title: "Updated Title",
      });

      expect(updated?.quantity).toBe(20);
      expect(updated?.title).toBe("Updated Title");
      expect(updated?.author).toBe("Original Author");
    });

    test("should return undefined when updating non-existent book", async () => {
      const result = await bookService.updateBook("non-existent-id", {
        quantity: 5,
      });

      expect(result).toBeUndefined();
    });
  });

  describe("deleteBook", () => {
    test("should delete a book", async () => {
      const input: CreateBookInput = {
        title: "Book to Delete",
        author: "Author",
        isbn: "ISBN123",
        genre: "fiction",
        publishedYear: 2020,
        quantity: 1,
      };

      const createdBook = await bookService.createBook(input);
      const deleted = await bookService.deleteBook(createdBook.id);

      expect(deleted).toBe(true);

      const foundBook = await bookService.getBookById(createdBook.id);
      expect(foundBook).toBeUndefined();
    });

    test("should return false when deleting non-existent book", async () => {
      const deleted = await bookService.deleteBook("non-existent-id");
      expect(deleted).toBe(false);
    });
  });
});
