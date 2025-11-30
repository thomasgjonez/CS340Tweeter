import {
  AuthToken,
  CreateUserResponse,
  FakeData,
  User,
  UserDto,
} from "tweeter-shared";
import { DAOFactory } from "../../factory/DAOFactory";
import { AuthorizationService } from "./AuthorizationService";
import bcrypt from "bcryptjs";

export class UserService {
  private DAOFactory: DAOFactory;
  public constructor(DAOFactory: DAOFactory) {
    this.DAOFactory = DAOFactory;
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    const authService = new AuthorizationService(this.DAOFactory);
    const userDAO = this.DAOFactory.makeUserDAO();

    try {
      //const user: User | null = FakeData.instance.findUserByAlias(alias);
      await authService.requireAuth(token);
      const user: User | null = await userDAO.getUser(alias);

      if (!user) {
        return null;
      }

      return user.dto;
    } catch (error) {
      throw error;
    }
  }
  public async login(
    alias: string,
    password: string
  ): Promise<CreateUserResponse> {
    const userDAO = this.DAOFactory.makeUserDAO();
    const authDAO = this.DAOFactory.makeAuthTokenDAO();
    try {
      //const user = FakeData.instance.firstUser;

      const user = await userDAO.getUser(alias);

      if (!user) {
        return {
          success: false,
          message: "Invalid alias or password",
          user: null,
          authToken: null,
        };
      }

      // move to authorizatoinService
      // 2. Validate password
      const passwordHash = await userDAO.getPasswordHash(alias);

      if (passwordHash === null) {
        return {
          success: false,
          message: "Invalid username or password",
          user: null,
          authToken: null,
        };
      }

      const correct = bcrypt.compare(password, passwordHash);

      if (!correct) {
        return {
          success: false,
          message: "Invalid alias or password",
          user: null,
          authToken: null,
        };
      }

      // 3. Create new auth token
      const authToken = AuthToken.Generate();
      await authDAO.putToken(alias, authToken);

      // 4. Return success + user DTO
      return {
        success: true,
        message: "Login successful",
        user: user.dto,
        authToken: authToken.dto,
      };
    } catch (error) {
      throw error;
    }
  }

  //   const authToken = AuthToken.Generate();

  //   const response: CreateUserResponse = {
  //     success: true,
  //     message: "Login successful",
  //     user: user.dto,
  //     authToken: authToken.dto,
  //   };

  //   return response;
  // }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<CreateUserResponse> {
    //make sure you upload image to s3 bucket
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
