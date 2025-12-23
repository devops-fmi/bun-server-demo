import { Repository } from "./Repository";
import { Library, CreateLibraryInput } from "../models/index";

/**
 * In-memory implementation of Library repository
 * Will be replaced with actual database implementation later
 */
export class LibraryRepository implements Repository<Library> {
  private libraries: Map<string, Library> = new Map();

  async create(input: CreateLibraryInput): Promise<Library> {
    const id = crypto.randomUUID();
    const library: Library = {
      ...input,
      id,
      totalBooks: 0,
      createdAt: new Date(),
    };
    this.libraries.set(id, library);
    return library;
  }

  async findById(id: string): Promise<Library | undefined> {
    return this.libraries.get(id);
  }

  async findAll(): Promise<Library[]> {
    return Array.from(this.libraries.values());
  }

  async update(
    id: string,
    input: Partial<Omit<Library, "id" | "createdAt">>,
  ): Promise<Library | undefined> {
    const library = this.libraries.get(id);
    if (!library) return undefined;

    const updated: Library = {
      ...library,
      ...input,
      id: library.id,
      createdAt: library.createdAt,
    };
    this.libraries.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.libraries.delete(id);
  }
}
