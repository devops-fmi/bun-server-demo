import { Repository } from "./Repository";
import { User, CreateUserInput } from "../models/index";

/**
 * In-memory implementation of User repository
 * Will be replaced with actual database implementation later
 */
export class UserRepository implements Repository<User> {
  private users: Map<string, User> = new Map();

  async create(input: CreateUserInput): Promise<User> {
    const id = crypto.randomUUID();
    const user: User = {
      ...input,
      id,
      role: input.role || "user",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async update(
    id: string,
    input: Partial<Omit<User, "id" | "createdAt">>,
  ): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updated: User = {
      ...user,
      ...input,
      id: user.id,
      createdAt: user.createdAt,
    };
    this.users.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}
