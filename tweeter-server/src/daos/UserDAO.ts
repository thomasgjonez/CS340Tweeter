import { User } from "tweeter-shared";

export interface UserDAO {
  createUser(
    firstName: string,
    lastName: string,
    alias: string,
    passwordHash: string,
    imageUrl: string
  ): User | null;

  getUser(alias: string): User | null;

  loginUser(alias: string, passwordHash: string): User | null;
}
