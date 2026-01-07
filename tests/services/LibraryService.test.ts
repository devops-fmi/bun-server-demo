import { describe, test, expect, beforeEach } from "bun:test";
import { LibraryService } from "../../src/services/LibraryService";
import { LibraryRepository } from "../../src/repositories/LibraryRepository";
import { CreateLibraryInput } from "../../src/models/index";

describe("LibraryService", () => {
  let libraryService: LibraryService;
  let libraryRepository: LibraryRepository;

  beforeEach(() => {
    libraryRepository = new LibraryRepository();
    libraryRepository.clearAll();
    libraryService = new LibraryService(libraryRepository);
  });

  describe("createLibrary", () => {
    test("should create a new library through the service", async () => {
      const managerId = crypto.randomUUID();
      const input: CreateLibraryInput = {
        name: "Main Library",
        location: "Downtown",
        manager: managerId,
      };

      const library = await libraryService.createLibrary(input);

      expect(library.id).toBeDefined();
      expect(library.name).toBe("Main Library");
      expect(library.location).toBe("Downtown");
      expect(library.manager).toBe(managerId);
    });
  });

  describe("getLibraryById", () => {
    test("should retrieve a library by ID", async () => {
      const managerId = crypto.randomUUID();
      const input: CreateLibraryInput = {
        name: "Test Library",
        location: "Test Location",
        manager: managerId,
      };

      const createdLibrary = await libraryService.createLibrary(input);
      const retrievedLibrary = await libraryService.getLibraryById(
        createdLibrary.id,
      );

      expect(retrievedLibrary).toBeDefined();
      expect(retrievedLibrary?.id).toBe(createdLibrary.id);
      expect(retrievedLibrary?.name).toBe("Test Library");
    });

    test("should return undefined for non-existent library", async () => {
      const library = await libraryService.getLibraryById("non-existent-id");
      expect(library).toBeUndefined();
    });
  });

  describe("getAllLibraries", () => {
    test("should retrieve all libraries", async () => {
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

      await libraryService.createLibrary(input1);
      await libraryService.createLibrary(input2);

      const libraries = await libraryService.getAllLibraries();

      expect(libraries).toHaveLength(2);
      expect(libraries.map((l) => l.name)).toEqual(["Library 1", "Library 2"]);
    });
  });

  describe("updateLibrary", () => {
    test("should update a library", async () => {
      const managerId = crypto.randomUUID();
      const input: CreateLibraryInput = {
        name: "Original Name",
        location: "Original Location",
        manager: managerId,
      };

      const createdLibrary = await libraryService.createLibrary(input);
      const updated = await libraryService.updateLibrary(createdLibrary.id, {
        name: "Updated Name",
        totalBooks: 500,
      });

      expect(updated?.name).toBe("Updated Name");
      expect(updated?.totalBooks).toBe(500);
      expect(updated?.location).toBe("Original Location");
    });

    test("should return undefined when updating non-existent library", async () => {
      const result = await libraryService.updateLibrary("non-existent-id", {
        name: "New Name",
      });

      expect(result).toBeUndefined();
    });
  });

  describe("deleteLibrary", () => {
    test("should delete a library", async () => {
      const managerId = crypto.randomUUID();
      const input: CreateLibraryInput = {
        name: "Library to Delete",
        location: "Test Location",
        manager: managerId,
      };

      const createdLibrary = await libraryService.createLibrary(input);
      const deleted = await libraryService.deleteLibrary(createdLibrary.id);

      expect(deleted).toBe(true);

      const foundLibrary = await libraryService.getLibraryById(
        createdLibrary.id,
      );
      expect(foundLibrary).toBeUndefined();
    });

    test("should return false when deleting non-existent library", async () => {
      const deleted = await libraryService.deleteLibrary("non-existent-id");
      expect(deleted).toBe(false);
    });
  });

  describe("getLibrariesByFilters", () => {
    test("should filter libraries by name", async () => {
      const managerId1 = crypto.randomUUID();
      const managerId2 = crypto.randomUUID();

      await libraryService.createLibrary({
        name: "Central Library",
        location: "Downtown",
        manager: managerId1,
      });
      await libraryService.createLibrary({
        name: "North Branch Library",
        location: "North",
        manager: managerId2,
      });
      await libraryService.createLibrary({
        name: "Main Hall",
        location: "City Center",
        manager: managerId1,
      });

      const results = await libraryService.getLibrariesByFilters({
        name: "Library",
      });

      expect(results).toHaveLength(2);
      expect(results.map((l) => l.name)).toEqual(
        expect.arrayContaining(["Central Library", "North Branch Library"]),
      );
    });

    test("should filter libraries by location", async () => {
      const managerId1 = crypto.randomUUID();
      const managerId2 = crypto.randomUUID();

      await libraryService.createLibrary({
        name: "Downtown Library",
        location: "Downtown District",
        manager: managerId1,
      });
      await libraryService.createLibrary({
        name: "Uptown Library",
        location: "Uptown Area",
        manager: managerId2,
      });

      const results = await libraryService.getLibrariesByFilters({
        location: "Downtown",
      });

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("Downtown Library");
    });

    test("should filter libraries by manager", async () => {
      const managerId1 = crypto.randomUUID();
      const managerId2 = crypto.randomUUID();

      await libraryService.createLibrary({
        name: "Library A",
        location: "Location A",
        manager: managerId1,
      });
      await libraryService.createLibrary({
        name: "Library B",
        location: "Location B",
        manager: managerId2,
      });
      await libraryService.createLibrary({
        name: "Library C",
        location: "Location C",
        manager: managerId1,
      });

      const results = await libraryService.getLibrariesByFilters({
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

      const lib1 = await libraryService.createLibrary({
        name: "Central Library",
        location: "Downtown",
        manager: managerId1,
      });
      const lib2 = await libraryService.createLibrary({
        name: "Branch Library",
        location: "Downtown",
        manager: managerId2,
      });
      const lib3 = await libraryService.createLibrary({
        name: "Central Hub",
        location: "Uptown",
        manager: managerId1,
      });

      await libraryService.updateLibrary(lib1.id, { totalBooks: 5000 });
      await libraryService.updateLibrary(lib2.id, { totalBooks: 3000 });
      await libraryService.updateLibrary(lib3.id, { totalBooks: 2000 });

      const results = await libraryService.getLibrariesByFilters({
        name: "Central",
        location: "Downtown",
        manager: managerId1,
      });

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(lib1.id);
    });

    test("should return empty array when no libraries match filters", async () => {
      const managerId = crypto.randomUUID();
      await libraryService.createLibrary({
        name: "Test Library",
        location: "Test Location",
        manager: managerId,
      });

      const results = await libraryService.getLibrariesByFilters({
        name: "NonExistent",
      });

      expect(results).toHaveLength(0);
    });
  });
});
