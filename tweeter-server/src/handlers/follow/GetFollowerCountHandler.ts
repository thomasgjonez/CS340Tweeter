import { FollowCountRequest, FollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";

export const handler = async (
  request: FollowCountRequest
): Promise<FollowCountResponse> => {
  const followServie = new FollowService(new DynamoDBFactory());
  const count = await followServie.getFollowerCount(
    request.token,
    request.user
  );

  return {
    success: true,
    count: count,
  };
};
