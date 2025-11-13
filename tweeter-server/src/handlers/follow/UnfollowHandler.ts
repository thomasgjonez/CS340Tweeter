import { FollowActionRequest, FollowActionResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: FollowActionRequest
): Promise<FollowActionResponse> => {
  const followServie = new FollowService();
  const [followerCount, followeeCount] = await followServie.unfollow(
    request.token,
    request.user
  );

  return {
    success: true,
    followerCount: followerCount,
    followeeCount: followeeCount,
  };
};
