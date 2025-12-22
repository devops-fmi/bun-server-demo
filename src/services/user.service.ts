import { User, CreateUserInput } from "../models/user";

// Simple in-memory store for demo purposes
const users = new Map<string, User>();

export abstract class UserService {
  static create(input: CreateUserInput): User {
    const id = crypto.randomUUID();
    const user: User = {
      ...input,
      id,
      createdAt: new Date(),
    };
    users.set(id, user);
    return user;
  }

  static getAll(): User[] {
    return Array.from(users.values());
  }

  static getById(id: string): User | undefined {
    return users.get(id);
  }

  static update(id: string, input: Partial<CreateUserInput>): User | undefined {
    const user = users.get(id);
    if (!user) return undefined;

    const updated: User = {
      ...user,
      ...input,
      id: user.id,
      createdAt: user.createdAt,
    };
    users.set(id, updated);
    return updated;
  }

  static delete(id: string): boolean {
    return users.delete(id);
  }
}
