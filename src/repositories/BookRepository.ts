import { mockBooks } from "../mocks";
import { Book, CreateBookInput } from "../models/index";
import { Repository } from "./Repository";

/**
 * In-memory implementation of Book repository
 * Will be replaced with actual database implementation later
 */
export class BookRepository implements Repository<Book> {
  private books: Map<string, Book> = new Map(
    mockBooks.map((book) => [book.id, book]),
  );

  async create(input: CreateBookInput): Promise<Book> {
    const id = crypto.randomUUID();
    const book: Book = {
      ...input,
      id,
      createdAt: new Date(),
    };
    this.books.set(id, book);
    return book;
  }

  async findById(id: string): Promise<Book | undefined> {
    return this.books.get(id);
  }

  async findAll(): Promise<Book[]> {
    return Array.from(this.books.values());
  }

  async findByGenre(genre: string): Promise<Book[]> {
    return Array.from(this.books.values()).filter(
      (book) => book.genre === genre,
    );
  }

  async update(
    id: string,
    input: Partial<Omit<Book, "id" | "createdAt">>,
  ): Promise<Book | undefined> {
    const book = this.books.get(id);
    if (!book) return undefined;

    const updated: Book = {
      ...book,
      ...input,
      id: book.id,
      createdAt: book.createdAt,
    };
    this.books.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.books.delete(id);
  }
}
