import { describe, test, expect, beforeEach } from "bun:test";
import { BookRepository } from "../../src/repositories/BookRepository";
import { CreateBookInput } from "../../src/models/index";

describe("BookRepository", () => {
  let bookRepository: BookRepository;

  beforeEach(() => {
    bookRepository = new BookRepository();
  });

  describe("create", () => {
    test("should create a new book", async () => {
      const input: CreateBookInput = {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "978-0743273565",
        genre: "fiction",
        publishedYear: 1925,
        quantity: 10,
      };

      const book = await bookRepository.create(input);

      expect(book.id).toBeDefined();
      expect(book.title).toBe("The Great Gatsby");
      expect(book.author).toBe("F. Scott Fitzgerald");
      expect(book.genre).toBe("fiction");
      expect(book.createdAt).toBeDefined();
    });
  });

  describe("findById", () => {
    test("should find a book by ID", async () => {
      const input: CreateBookInput = {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "978-0061120084",
        genre: "fiction",
        publishedYear: 1960,
        quantity: 5,
      };

      const createdBook = await bookRepository.create(input);
      const foundBook = await bookRepository.findById(createdBook.id);

      expect(foundBook).toBeDefined();
      expect(foundBook?.id).toBe(createdBook.id);
      expect(foundBook?.title).toBe("To Kill a Mockingbird");
    });

    test("should return undefined for non-existent book", async () => {
      const book = await bookRepository.findById("non-existent-id");
      expect(book).toBeUndefined();
    });
  });

  describe("findAll", () => {
    test("should return empty array initially", async () => {
      const books = await bookRepository.findAll();
      expect(books).toEqual([]);
    });

    test("should return all created books", async () => {
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

      await bookRepository.create(input1);
      await bookRepository.create(input2);

      const books = await bookRepository.findAll();

      expect(books).toHaveLength(2);
      expect(books.map((b) => b.title)).toEqual(["Book 1", "Book 2"]);
    });
  });

  describe("findByGenre", () => {
    test("should find books by genre", async () => {
      const fictionBook: CreateBookInput = {
        title: "Fiction Book",
        author: "Author",
        isbn: "ISBN1",
        genre: "fiction",
        publishedYear: 2020,
        quantity: 1,
      };
      const nonfictionBook: CreateBookInput = {
        title: "Non-Fiction Book",
        author: "Author",
        isbn: "ISBN2",
        genre: "non-fiction",
        publishedYear: 2021,
        quantity: 1,
      };

      await bookRepository.create(fictionBook);
      await bookRepository.create(nonfictionBook);

      const fictionBooks = await bookRepository.findByGenre("fiction");

      expect(fictionBooks).toHaveLength(1);
      expect(fictionBooks[0].title).toBe("Fiction Book");
    });

    test("should return empty array when no books match genre", async () => {
      const books = await bookRepository.findByGenre("fantasy");
      expect(books).toEqual([]);
    });
  });

  describe("update", () => {
    test("should update book properties", async () => {
      const input: CreateBookInput = {
        title: "Original Title",
        author: "Original Author",
        isbn: "ISBN123",
        genre: "fiction",
        publishedYear: 2020,
        quantity: 5,
      };

      const createdBook = await bookRepository.create(input);
      const updated = await bookRepository.update(createdBook.id, {
        quantity: 10,
        author: "New Author",
      });

      expect(updated).toBeDefined();
      expect(updated?.quantity).toBe(10);
      expect(updated?.author).toBe("New Author");
      expect(updated?.title).toBe("Original Title");
    });

    test("should return undefined when updating non-existent book", async () => {
      const result = await bookRepository.update("non-existent-id", {
        quantity: 5,
      });

      expect(result).toBeUndefined();
    });
  });

  describe("delete", () => {
    test("should delete a book", async () => {
      const input: CreateBookInput = {
        title: "Book to Delete",
        author: "Author",
        isbn: "ISBN123",
        genre: "fiction",
        publishedYear: 2020,
        quantity: 1,
      };

      const createdBook = await bookRepository.create(input);
      const deleted = await bookRepository.delete(createdBook.id);

      expect(deleted).toBe(true);

      const foundBook = await bookRepository.findById(createdBook.id);
      expect(foundBook).toBeUndefined();
    });

    test("should return false when deleting non-existent book", async () => {
      const deleted = await bookRepository.delete("non-existent-id");
      expect(deleted).toBe(false);
    });
  });
});
