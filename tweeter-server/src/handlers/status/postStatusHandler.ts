import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";

export const handler = async (
  request: PostStatusRequest
): Promise<PostStatusResponse> => {
  const statusService = new StatusService(new DynamoDBFactory());
  const result = await statusService.postStatus(
    request.token,
    request.newStatus
  );

  return {
    success: result,
    message: "Status was posted",
  };
};
