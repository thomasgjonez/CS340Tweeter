import { UserService } from "../../model/service/UserService";
import { CreateUserRequest, CreateUserResponse } from "tweeter-shared";

export const handler = async (
  request: CreateUserRequest
): Promise<CreateUserResponse> => {
  const userService = new UserService();
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
};
