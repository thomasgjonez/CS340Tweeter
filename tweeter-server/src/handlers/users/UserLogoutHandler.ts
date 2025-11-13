import { LogoutUserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { LogoutUserResponse } from "tweeter-shared";

export const handler = async (
  request: LogoutUserRequest
): Promise<LogoutUserResponse> => {
  const userService = new UserService();
  userService.logout(request.token);

  return {
    success: true,
  };
};
