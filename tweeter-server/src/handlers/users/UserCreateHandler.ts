import { DynamoDBFactory } from "../../factory/DynamoDBFactory";
import { UserService } from "../../model/service/UserService";
import { CreateUserRequest, CreateUserResponse } from "tweeter-shared";

export const handler = async (
  request: CreateUserRequest
): Promise<CreateUserResponse> => {
  try {
    const userService = new UserService(new DynamoDBFactory());
    const imageBytes = Buffer.from(request.userImageBase64, "base64");
    const response = await userService.register(
      request.firstName,
      request.lastName,
      request.alias,
      request.password,
      imageBytes,
      request.imageFileExtension
    );

    return response;
  } catch (error: any) {
    return {
      success: false,
      message: error.message ?? "unknown error occured",
      user: null,
      authToken: null,
    };
  }
};
