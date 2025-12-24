import { UserRepository } from "../repositories/UserRepository";
import { User, CreateUserInput } from "../models/index";

/**
 * User service layer
 * Handles business logic for user operations
 */
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(input: CreateUserInput): Promise<User> {
    return this.userRepository.create(input);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.userRepository.findById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async updateUser(
    id: string,
    input: Partial<Omit<User, "id" | "createdAt">>,
  ): Promise<User | undefined> {
    return this.userRepository.update(id, input);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
