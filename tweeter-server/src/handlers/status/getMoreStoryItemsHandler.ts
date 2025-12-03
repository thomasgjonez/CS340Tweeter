import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
} from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";

export const handler = async (
  request: PagedStatusItemRequest
): Promise<PagedStatusItemResponse> => {
  const statusService = new StatusService(new DynamoDBFactory());
  const [items, hasMore] = await statusService.loadMoreStoryItems(
    request.token,
    request.alias,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    items: items,
    hasMore: hasMore,
  };
};
