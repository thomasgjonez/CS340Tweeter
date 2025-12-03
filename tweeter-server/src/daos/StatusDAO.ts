import { StatusDto } from "tweeter-shared";
import { DataPage } from "../DataPage";

export interface StatusDAO {
  putStoryStatus(status: StatusDto): Promise<void>;
  putFeedStatus(followerAlias: string, status: StatusDto): Promise<void>;
  getPageOfStatuses(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<DataPage<StatusDto>>;
}
