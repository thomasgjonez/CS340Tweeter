import { DynamoDBFactory } from "../../factory/DynamoDBFactory";
import { UserService } from "../../model/service/UserService";
import { GetUserRequest, GetUserResponse } from "tweeter-shared";

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse> => {
  try {
    const userService = new UserService(new DynamoDBFactory());
    const user = await userService.getUser(request.token, request.alias);

    return {
      success: true,
      user: user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message ?? "unknown error occured",
      user: null,
    };
  }
};
