import { FollowerStatusRequest, FollowerStatusResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: FollowerStatusRequest
): Promise<FollowerStatusResponse> => {
  const followService = new FollowService();
  const result = await followService.getIsFollowerStatus(
    request.token,
    request.user,
    request.selectedUser
  );

  return {
    success: true,
    result: result,
  };
};
