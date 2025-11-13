import { UserService } from "../../model/service/UserService";
import { CreateUserRequest, CreateUserResponse } from "tweeter-shared";

export const handler = async (
  request: CreateUserRequest
): Promise<CreateUserResponse> => {
  const userService = new UserService();
  const response = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );

  return response;
};
