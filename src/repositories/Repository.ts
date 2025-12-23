/**
 * Generic Repository interface for CRUD operations
 * Provides a contract for data access layer implementations
 */
export interface Repository<T> {
  /**
   * Create a new entity
   */
  create(entity: Omit<T, 'id' | 'createdAt'>): Promise<T>

  /**
   * Find an entity by ID
   */
  findById(id: string): Promise<T | undefined>

  /**
   * Find all entities
   */
  findAll(): Promise<T[]>

  /**
   * Update an entity
   */
  update(id: string, entity: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | undefined>

  /**
   * Delete an entity
   */
  delete(id: string): Promise<boolean>
}
