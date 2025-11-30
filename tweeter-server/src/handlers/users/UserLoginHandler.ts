import { CreateUserResponse, LoginUserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";

export const handler = async (
  request: LoginUserRequest
): Promise<CreateUserResponse> => {
  //CreateuserResponse contains everything needed for LoginUserResponse
  const userService = new UserService(new DynamoDBFactory());
  const response = await userService.login(request.alias, request.password);

  return response;
};
