import { AuthToken, CreateUserResponse, User, UserDto } from "tweeter-shared";
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
      const user = await userDAO.getUser(alias);

      if (!user) {
        throw new Error("Invalid alias");
      }

      const passwordHash = await userDAO.getPasswordHash(alias);

      if (passwordHash === null) {
        throw new Error("Invalid password");
      }

      const correct = await bcrypt.compare(password, passwordHash);

      if (!correct) {
        throw new Error("Invalid password");
      }

      const authToken = AuthToken.Generate();
      await authDAO.putToken(alias, authToken);

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

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<CreateUserResponse> {
    try {
      const userDAO = this.DAOFactory.makeUserDAO();
      const authDAO = this.DAOFactory.makeAuthTokenDAO();

      if (!alias.startsWith("@")) {
        throw new Error("Alias must begin with '@'");
      }

      const existingUser = await userDAO.getUser(alias);
      if (existingUser) {
        throw new Error("Alias already taken");
      }

      const imageBase64 = Buffer.from(userImageBytes).toString("base64");
      const imageUrl = await this.uploadUserImageToS3(
        alias,
        imageBase64,
        imageFileExtension
      );
      const passwordHash = await bcrypt.hash(password, 10);

      await userDAO.createUser(
        firstName,
        lastName,
        alias,
        passwordHash,
        imageUrl
      );

      const authToken = AuthToken.Generate();
      await authDAO.putToken(alias, authToken);

      const user = new User(firstName, lastName, alias, imageUrl);
      const response: CreateUserResponse = {
        success: true,
        message: "Login successful",
        user: user.dto,
        authToken: authToken.dto,
      };

      return response;
    } catch (error) {
      throw error;
    }
  }

  public async logout(token: string): Promise<void> {
    try {
      const authDAO = this.DAOFactory.makeAuthTokenDAO();
      await authDAO.deleteToken(token);
    } catch (error: any) {
      throw new Error(`Unable to logout: ${error.message}`);
    }
  }

  private async uploadUserImageToS3(
    alias: string,
    imageBase64: string,
    extension: string
  ): Promise<string> {
    try {
      const s3 = this.DAOFactory.makeS3DAO();
      const cleanAlias = alias.startsWith("@") ? alias.substring(1) : alias;

      const key = `profile-images/${cleanAlias}.${extension}`;

      await s3.putImage(key, imageBase64, `image/${extension}`);

      return `https://cs340-tweeter-images-tgjones.s3.amazonaws.com/${key}`;
    } catch (error) {
      throw error;
    }
  }
}
