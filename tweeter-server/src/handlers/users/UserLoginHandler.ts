import { CreateUserResponse, LoginUserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";

export const handler = async (
  request: LoginUserRequest
): Promise<CreateUserResponse> => {
  try {
    const userService = new UserService(new DynamoDBFactory());
    const response = await userService.login(request.alias, request.password);

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
