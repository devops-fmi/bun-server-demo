import { BookRepository } from "../repositories/BookRepository";
import { Book, CreateBookInput } from "../models/index";

/**
 * Book service layer
 * Handles business logic for book operations
 */
export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async createBook(input: CreateBookInput): Promise<Book> {
    return this.bookRepository.create(input);
  }

  async getBookById(id: string): Promise<Book | undefined> {
    return this.bookRepository.findById(id);
  }

  async getAllBooks(): Promise<Book[]> {
    return this.bookRepository.findAll();
  }

  async getBooksByGenre(genre: string): Promise<Book[]> {
    return this.bookRepository.findByGenre(genre);
  }

  async updateBook(
    id: string,
    input: Partial<Omit<Book, "id" | "createdAt">>,
  ): Promise<Book | undefined> {
    return this.bookRepository.update(id, input);
  }

  async deleteBook(id: string): Promise<boolean> {
    return this.bookRepository.delete(id);
  }
}
