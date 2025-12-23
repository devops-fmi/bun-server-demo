import { describe, test, expect, beforeEach } from 'bun:test'
import { UserRepository } from '../../src/repositories/UserRepository'
import { CreateUserInput } from '../../src/models/index'

describe('UserRepository', () => {
  let userRepository: UserRepository

  beforeEach(() => {
    userRepository = new UserRepository()
  })

  describe('create', () => {
    test('should create a new user', async () => {
      const input: CreateUserInput = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
      }

      const user = await userRepository.create(input)

      expect(user.id).toBeDefined()
      expect(user.name).toBe('John Doe')
      expect(user.email).toBe('john@example.com')
      expect(user.role).toBe('user')
      expect(user.createdAt).toBeDefined()
    })

    test('should set default role to user when not provided', async () => {
      const input: CreateUserInput = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      }

      const user = await userRepository.create(input)

      expect(user.role).toBe('user')
    })
  })

  describe('findById', () => {
    test('should find a user by ID', async () => {
      const input: CreateUserInput = {
        name: 'John Doe',
        email: 'john@example.com',
      }

      const createdUser = await userRepository.create(input)
      const foundUser = await userRepository.findById(createdUser.id)

      expect(foundUser).toBeDefined()
      expect(foundUser?.id).toBe(createdUser.id)
      expect(foundUser?.name).toBe('John Doe')
    })

    test('should return undefined for non-existent user', async () => {
      const user = await userRepository.findById('non-existent-id')
      expect(user).toBeUndefined()
    })
  })

  describe('findAll', () => {
    test('should return empty array initially', async () => {
      const users = await userRepository.findAll()
      expect(users).toEqual([])
    })

    test('should return all created users', async () => {
      const input1: CreateUserInput = {
        name: 'User 1',
        email: 'user1@example.com',
      }
      const input2: CreateUserInput = {
        name: 'User 2',
        email: 'user2@example.com',
      }

      await userRepository.create(input1)
      await userRepository.create(input2)

      const users = await userRepository.findAll()

      expect(users).toHaveLength(2)
      expect(users.map((u) => u.name)).toEqual(['User 1', 'User 2'])
    })
  })

  describe('update', () => {
    test('should update user properties', async () => {
      const input: CreateUserInput = {
        name: 'Original Name',
        email: 'original@example.com',
      }

      const createdUser = await userRepository.create(input)
      const updated = await userRepository.update(createdUser.id, {
        name: 'Updated Name',
      })

      expect(updated).toBeDefined()
      expect(updated?.name).toBe('Updated Name')
      expect(updated?.email).toBe('original@example.com')
      expect(updated?.id).toBe(createdUser.id)
    })

    test('should return undefined when updating non-existent user', async () => {
      const result = await userRepository.update('non-existent-id', {
        name: 'New Name',
      })

      expect(result).toBeUndefined()
    })

    test('should preserve createdAt on update', async () => {
      const input: CreateUserInput = {
        name: 'User',
        email: 'user@example.com',
      }

      const createdUser = await userRepository.create(input)
      const updated = await userRepository.update(createdUser.id, {
        name: 'Updated',
      })

      expect(updated?.createdAt).toEqual(createdUser.createdAt)
    })
  })

  describe('delete', () => {
    test('should delete a user', async () => {
      const input: CreateUserInput = {
        name: 'User to Delete',
        email: 'delete@example.com',
      }

      const createdUser = await userRepository.create(input)
      const deleted = await userRepository.delete(createdUser.id)

      expect(deleted).toBe(true)

      const foundUser = await userRepository.findById(createdUser.id)
      expect(foundUser).toBeUndefined()
    })

    test('should return false when deleting non-existent user', async () => {
      const deleted = await userRepository.delete('non-existent-id')
      expect(deleted).toBe(false)
    })
  })
})
