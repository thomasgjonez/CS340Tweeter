import { FollowerStatusRequest, FollowerStatusResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";

export const handler = async (
  request: FollowerStatusRequest
): Promise<FollowerStatusResponse> => {
  const followService = new FollowService(new DynamoDBFactory());
  const result = await followService.getIsFollowerStatus(
    request.token,
    request.user.alias,
    request.selectedUser.alias
  );

  return {
    success: true,
    result: result,
  };
};
