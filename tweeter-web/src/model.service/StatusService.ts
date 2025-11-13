import {
  AuthToken,
  Status,
  PagedStatusItemRequest,
  PostStatusRequest,
  PostStatusResponse,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService implements Service {
  private serverFacade: ServerFacade;

  constructor(serverFacade?: ServerFacade) {
    this.serverFacade = serverFacade ?? new ServerFacade();
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const token = authToken.token;
    const item = lastItem === null ? null : lastItem.dto;
    const request: PagedStatusItemRequest = {
      token: token,
      alias: userAlias,
      pageSize: pageSize,
      lastItem: item,
    };
    return this.serverFacade.getMoreFeedItems(request);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    const token = authToken.token;
    const item = lastItem === null ? null : lastItem.dto;
    const request: PagedStatusItemRequest = {
      token: token,
      alias: userAlias,
      pageSize: pageSize,
      lastItem: item,
    };
    return this.serverFacade.getMoreStoryItems(request);
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    const token = authToken.token;
    const status = newStatus.dto;
    const request: PostStatusRequest = { token, newStatus: status };
    const result: PostStatusResponse = await this.serverFacade.postStatus(
      request
    );
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  }
}
