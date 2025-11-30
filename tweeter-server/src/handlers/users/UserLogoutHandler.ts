import { LogoutUserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { LogoutUserResponse } from "tweeter-shared";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";

export const handler = async (
  request: LogoutUserRequest
): Promise<LogoutUserResponse> => {
  const userService = new UserService(new DynamoDBFactory());
  userService.logout(request.token);

  return {
    success: true,
  };
};
