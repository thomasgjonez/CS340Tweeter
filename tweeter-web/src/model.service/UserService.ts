import {
  AuthToken,
  User,
  GetUserRequest,
  GetUserResponse,
  LoginUserRequest,
  CreateUserRequest,
  CreateUserResponse,
  LogoutUserRequest,
  LogoutUserResponse,
} from "tweeter-shared";
import { Buffer } from "buffer";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class UserService implements Service {
  private serverFacade: ServerFacade;

  constructor(serverFacade?: ServerFacade) {
    this.serverFacade = serverFacade ?? new ServerFacade();
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    const token = authToken.token;
    const request: GetUserRequest = { token, alias };
    const response: GetUserResponse = await this.serverFacade.getUser(request);

    if (response.success && response.user) {
      return User.fromDto(response.user);
    } else {
      return null;
    }
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    // TODO: Replace with the result of calling the server
    const request: LoginUserRequest = { alias, password };
    const response: CreateUserResponse = await this.serverFacade.login(request);

    if (!response.success || !response.user || !response.authToken) {
      throw new Error(response.message ?? "Login failed");
    }

    const user = User.fromDto(response.user);
    const authToken = AuthToken.fromDto(response.authToken);

    return [user!, authToken!];
  }
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const base64String = btoa(String.fromCharCode(...userImageBytes));
    const request: CreateUserRequest = {
      firstName,
      lastName,
      alias,
      password,
      userImageBase64: base64String,
      imageFileExtension,
    };

    const response: CreateUserResponse = await this.serverFacade.register(
      request
    );

    if (!response.success || !response.user || !response.authToken) {
      throw new Error(response.message ?? "Registration Failed");
    }

    const user = User.fromDto(response.user);
    const authToken = AuthToken.fromDto(response.authToken);

    return [user!, authToken!];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    const token = authToken.token;
    console.log(token);
    const request: LogoutUserRequest = { token };
    const response: LogoutUserResponse = await this.serverFacade.logout(
      request
    );
    await new Promise((res) => setTimeout(res, 1000));
  }
}
