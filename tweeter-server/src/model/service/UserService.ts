import {
  AuthToken,
  CreateUserResponse,
  FakeData,
  User,
  UserDto,
} from "tweeter-shared";

export class UserService {
  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    const user: User | null = FakeData.instance.findUserByAlias(alias);

    if (!user) {
      return null;
    }

    return user.dto;
  }
  public async login(
    alias: string,
    password: string
  ): Promise<CreateUserResponse> {
    // 1️⃣ Authenticate user (replace this with your actual DB lookup)
    const user = FakeData.instance.firstUser;
    if (user === null) {
      return {
        success: false,
        message: "Invalid alias or password",
        user: null,
        authToken: null,
      };
    }

    const authToken = AuthToken.Generate();

    const response: CreateUserResponse = {
      success: true,
      message: "Login successful",
      user: user.dto,
      authToken: authToken.dto,
    };

    return response;
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<CreateUserResponse> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }
    const authToken = AuthToken.Generate();

    const response: CreateUserResponse = {
      success: true,
      message: "Login successful",
      user: user.dto,
      authToken: authToken.dto,
    };

    return response;
  }

  public async logout(token: string): Promise<void> {}
}
