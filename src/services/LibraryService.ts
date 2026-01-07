import { LibraryRepository } from "../repositories/LibraryRepository";
import {
  Library,
  CreateLibraryInput,
  LibraryQueryInput,
} from "../models/index";

/**
 * Library service layer
 * Handles business logic for library operations
 */
export class LibraryService {
  constructor(private libraryRepository: LibraryRepository) {}

  async createLibrary(input: CreateLibraryInput): Promise<Library> {
    return this.libraryRepository.create(input);
  }

  async getLibraryById(id: string): Promise<Library | undefined> {
    return this.libraryRepository.findById(id);
  }

  async getAllLibraries(): Promise<Library[]> {
    return this.libraryRepository.findAll();
  }

  async getLibrariesByFilters(filters: LibraryQueryInput): Promise<Library[]> {
    return this.libraryRepository.findByFilters(filters);
  }

  async updateLibrary(
    id: string,
    input: Partial<Omit<Library, "id" | "createdAt">>,
  ): Promise<Library | undefined> {
    return this.libraryRepository.update(id, input);
  }

  async deleteLibrary(id: string): Promise<boolean> {
    return this.libraryRepository.delete(id);
  }
}
