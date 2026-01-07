import { mockLibraries } from "../mocks";
import {
  CreateLibraryInput,
  Library,
  LibraryQueryInput,
} from "../models/index";
import { Repository } from "./Repository";

/**
 * In-memory implementation of Library repository
 * Will be replaced with actual database implementation later
 */
export class LibraryRepository implements Repository<Library> {
  private libraries: Map<string, Library> = new Map(
    mockLibraries.map((library) => [library.id, library]),
  );

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

  async findByFilters(filters: LibraryQueryInput): Promise<Library[]> {
    return Array.from(this.libraries.values()).filter((library) => {
      if (
        filters.name &&
        !library.name.toLowerCase().includes(filters.name.toLowerCase())
      )
        return false;
      if (
        filters.location &&
        !library.location.toLowerCase().includes(filters.location.toLowerCase())
      )
        return false;
      if (filters.manager && library.manager !== filters.manager) return false;
      if (
        filters.totalBooks !== undefined &&
        library.totalBooks !== filters.totalBooks
      )
        return false;
      return true;
    });
  }
}
