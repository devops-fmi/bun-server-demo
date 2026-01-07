import { describe, test, expect, beforeEach } from "bun:test";
import { LibraryRepository } from "../../src/repositories/LibraryRepository";
import { CreateLibraryInput } from "../../src/models/index";

describe("LibraryRepository", () => {
  let libraryRepository: LibraryRepository;

  beforeEach(() => {
    libraryRepository = new LibraryRepository();
    libraryRepository.clearAll();
  });

  describe("create", () => {
    test("should create a new library", async () => {
      const managerId = crypto.randomUUID();
      const input: CreateLibraryInput = {
        name: "Central Library",
        location: "Downtown",
        manager: managerId,
      };

      const library = await libraryRepository.create(input);

      expect(library.id).toBeDefined();
      expect(library.name).toBe("Central Library");
      expect(library.location).toBe("Downtown");
      expect(library.manager).toBe(managerId);
      expect(library.totalBooks).toBe(0);
      expect(library.createdAt).toBeDefined();
    });
  });

  describe("findById", () => {
    test("should find a library by ID", async () => {
      const managerId = crypto.randomUUID();
      const input: CreateLibraryInput = {
        name: "Test Library",
        location: "Test Location",
        manager: managerId,
      };

      const createdLibrary = await libraryRepository.create(input);
      const foundLibrary = await libraryRepository.findById(createdLibrary.id);

      expect(foundLibrary).toBeDefined();
      expect(foundLibrary?.id).toBe(createdLibrary.id);
      expect(foundLibrary?.name).toBe("Test Library");
    });

    test("should return undefined for non-existent library", async () => {
      const library = await libraryRepository.findById("non-existent-id");
      expect(library).toBeUndefined();
    });
  });

  describe("findAll", () => {
    test("should return empty array initially", async () => {
      const libraries = await libraryRepository.findAll();
      expect(libraries).toEqual([]);
    });

    test("should return all created libraries", async () => {
      const managerId1 = crypto.randomUUID();
      const managerId2 = crypto.randomUUID();

      const input1: CreateLibraryInput = {
        name: "Library 1",
        location: "Location 1",
        manager: managerId1,
      };
      const input2: CreateLibraryInput = {
        name: "Library 2",
        location: "Location 2",
        manager: managerId2,
      };

      await libraryRepository.create(input1);
      await libraryRepository.create(input2);

      const libraries = await libraryRepository.findAll();

      expect(libraries).toHaveLength(2);
      expect(libraries.map((l) => l.name)).toEqual(["Library 1", "Library 2"]);
    });
  });

  describe("update", () => {
    test("should update library properties", async () => {
      const managerId = crypto.randomUUID();
      const input: CreateLibraryInput = {
        name: "Original Name",
        location: "Original Location",
        manager: managerId,
      };

      const createdLibrary = await libraryRepository.create(input);
      const updated = await libraryRepository.update(createdLibrary.id, {
        name: "Updated Name",
        totalBooks: 100,
      });

      expect(updated).toBeDefined();
      expect(updated?.name).toBe("Updated Name");
      expect(updated?.location).toBe("Original Location");
      expect(updated?.totalBooks).toBe(100);
    });

    test("should return undefined when updating non-existent library", async () => {
      const result = await libraryRepository.update("non-existent-id", {
        name: "New Name",
      });

      expect(result).toBeUndefined();
    });
  });

  describe("delete", () => {
    test("should delete a library", async () => {
      const managerId = crypto.randomUUID();
      const input: CreateLibraryInput = {
        name: "Library to Delete",
        location: "Test Location",
        manager: managerId,
      };

      const createdLibrary = await libraryRepository.create(input);
      const deleted = await libraryRepository.delete(createdLibrary.id);

      expect(deleted).toBe(true);

      const foundLibrary = await libraryRepository.findById(createdLibrary.id);
      expect(foundLibrary).toBeUndefined();
    });

    test("should return false when deleting non-existent library", async () => {
      const deleted = await libraryRepository.delete("non-existent-id");
      expect(deleted).toBe(false);
    });
  });

  describe("findByFilters", () => {
    test("should filter libraries by name (partial match)", async () => {
      const managerId1 = crypto.randomUUID();
      const managerId2 = crypto.randomUUID();

      await libraryRepository.create({
        name: "Central Library",
        location: "Downtown",
        manager: managerId1,
      });
      await libraryRepository.create({
        name: "North Branch Library",
        location: "North",
        manager: managerId2,
      });
      await libraryRepository.create({
        name: "Main Hall",
        location: "City Center",
        manager: managerId1,
      });

      const results = await libraryRepository.findByFilters({
        name: "Library",
      });

      expect(results).toHaveLength(2);
      expect(results.map((l) => l.name)).toEqual(
        expect.arrayContaining(["Central Library", "North Branch Library"]),
      );
    });

    test("should filter libraries by name (case insensitive)", async () => {
      const managerId = crypto.randomUUID();
      await libraryRepository.create({
        name: "Test Library",
        location: "Test",
        manager: managerId,
      });

      const results = await libraryRepository.findByFilters({ name: "test" });

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("Test Library");
    });

    test("should filter libraries by manager", async () => {
      const managerId1 = crypto.randomUUID();
      const managerId2 = crypto.randomUUID();

      await libraryRepository.create({
        name: "Library A",
        location: "Location A",
        manager: managerId1,
      });
      await libraryRepository.create({
        name: "Library B",
        location: "Location B",
        manager: managerId2,
      });
      await libraryRepository.create({
        name: "Library C",
        location: "Location C",
        manager: managerId1,
      });

      const results = await libraryRepository.findByFilters({
        manager: managerId1,
      });

      expect(results).toHaveLength(2);
      expect(results.map((l) => l.name)).toEqual(
        expect.arrayContaining(["Library A", "Library C"]),
      );
    });

    test("should combine multiple filters", async () => {
      const managerId1 = crypto.randomUUID();
      const managerId2 = crypto.randomUUID();

      const lib1 = await libraryRepository.create({
        name: "Central Library",
        location: "Downtown",
        manager: managerId1,
      });
      const lib2 = await libraryRepository.create({
        name: "Branch Library",
        location: "Downtown",
        manager: managerId2,
      });
      const lib3 = await libraryRepository.create({
        name: "Central Hub",
        location: "Uptown",
        manager: managerId1,
      });

      await libraryRepository.update(lib1.id, { totalBooks: 5000 });
      await libraryRepository.update(lib2.id, { totalBooks: 3000 });
      await libraryRepository.update(lib3.id, { totalBooks: 2000 });

      const results = await libraryRepository.findByFilters({
        name: "Central",
        location: "Downtown",
        manager: managerId1,
      });

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(lib1.id);
    });

    test("should return empty array when no filters match", async () => {
      const managerId = crypto.randomUUID();
      await libraryRepository.create({
        name: "Test Library",
        location: "Test Location",
        manager: managerId,
      });

      const results = await libraryRepository.findByFilters({
        name: "NonExistent",
      });

      expect(results).toHaveLength(0);
    });
  });
});
