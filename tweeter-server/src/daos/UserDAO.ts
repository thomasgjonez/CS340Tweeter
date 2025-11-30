import { User } from "tweeter-shared";

export interface UserDAO {
  createUser(
    firstName: string,
    lastName: string,
    alias: string,
    passwordHash: string,
    imageUrl: string
  ): Promise<User | null>;

  getUser(alias: string): Promise<User | null>;

  getPasswordHash(alias: string): Promise<string | null>;
}
