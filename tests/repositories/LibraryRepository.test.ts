import { describe, test, expect, beforeEach } from 'bun:test'
import { LibraryRepository } from '../../src/repositories/LibraryRepository'
import { CreateLibraryInput } from '../../src/models/index'

describe('LibraryRepository', () => {
  let libraryRepository: LibraryRepository

  beforeEach(() => {
    libraryRepository = new LibraryRepository()
  })

  describe('create', () => {
    test('should create a new library', async () => {
      const managerId = crypto.randomUUID()
      const input: CreateLibraryInput = {
        name: 'Central Library',
        location: 'Downtown',
        manager: managerId,
      }

      const library = await libraryRepository.create(input)

      expect(library.id).toBeDefined()
      expect(library.name).toBe('Central Library')
      expect(library.location).toBe('Downtown')
      expect(library.manager).toBe(managerId)
      expect(library.totalBooks).toBe(0)
      expect(library.createdAt).toBeDefined()
    })
  })

  describe('findById', () => {
    test('should find a library by ID', async () => {
      const managerId = crypto.randomUUID()
      const input: CreateLibraryInput = {
        name: 'Test Library',
        location: 'Test Location',
        manager: managerId,
      }

      const createdLibrary = await libraryRepository.create(input)
      const foundLibrary = await libraryRepository.findById(createdLibrary.id)

      expect(foundLibrary).toBeDefined()
      expect(foundLibrary?.id).toBe(createdLibrary.id)
      expect(foundLibrary?.name).toBe('Test Library')
    })

    test('should return undefined for non-existent library', async () => {
      const library = await libraryRepository.findById('non-existent-id')
      expect(library).toBeUndefined()
    })
  })

  describe('findAll', () => {
    test('should return empty array initially', async () => {
      const libraries = await libraryRepository.findAll()
      expect(libraries).toEqual([])
    })

    test('should return all created libraries', async () => {
      const managerId1 = crypto.randomUUID()
      const managerId2 = crypto.randomUUID()

      const input1: CreateLibraryInput = {
        name: 'Library 1',
        location: 'Location 1',
        manager: managerId1,
      }
      const input2: CreateLibraryInput = {
        name: 'Library 2',
        location: 'Location 2',
        manager: managerId2,
      }

      await libraryRepository.create(input1)
      await libraryRepository.create(input2)

      const libraries = await libraryRepository.findAll()

      expect(libraries).toHaveLength(2)
      expect(libraries.map((l) => l.name)).toEqual(['Library 1', 'Library 2'])
    })
  })

  describe('update', () => {
    test('should update library properties', async () => {
      const managerId = crypto.randomUUID()
      const input: CreateLibraryInput = {
        name: 'Original Name',
        location: 'Original Location',
        manager: managerId,
      }

      const createdLibrary = await libraryRepository.create(input)
      const updated = await libraryRepository.update(createdLibrary.id, {
        name: 'Updated Name',
        totalBooks: 100,
      })

      expect(updated).toBeDefined()
      expect(updated?.name).toBe('Updated Name')
      expect(updated?.location).toBe('Original Location')
      expect(updated?.totalBooks).toBe(100)
    })

    test('should return undefined when updating non-existent library', async () => {
      const result = await libraryRepository.update('non-existent-id', {
        name: 'New Name',
      })

      expect(result).toBeUndefined()
    })
  })

  describe('delete', () => {
    test('should delete a library', async () => {
      const managerId = crypto.randomUUID()
      const input: CreateLibraryInput = {
        name: 'Library to Delete',
        location: 'Test Location',
        manager: managerId,
      }

      const createdLibrary = await libraryRepository.create(input)
      const deleted = await libraryRepository.delete(createdLibrary.id)

      expect(deleted).toBe(true)

      const foundLibrary = await libraryRepository.findById(createdLibrary.id)
      expect(foundLibrary).toBeUndefined()
    })

    test('should return false when deleting non-existent library', async () => {
      const deleted = await libraryRepository.delete('non-existent-id')
      expect(deleted).toBe(false)
    })
  })
})
