import { FollowActionRequest, FollowActionResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";

export const handler = async (
  request: FollowActionRequest
): Promise<FollowActionResponse> => {
  const followServie = new FollowService(new DynamoDBFactory());
  const [followerCount, followeeCount] = await followServie.follow(
    request.token,
    request.user
  );

  return {
    success: true,
    followerCount: followerCount,
    followeeCount: followeeCount,
  };
};
