import { AuthToken } from "tweeter-shared";

export interface AuthTokenDAO {
  putToken(alias: string, authToken: AuthToken): Promise<void>;
  getToken(token: string): Promise<AuthToken | null>;
  deleteToken(token: string): Promise<void>;
}
