import {
  AuthToken,
  User,
  PagedUserItemRequest,
  FollowerStatusRequest,
  FollowerStatusResponse,
  FollowCountRequest,
  FollowCountResponse,
  FollowActionRequest,
  FollowActionResponse,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService implements Service {
  private serverFacade: ServerFacade;

  constructor(serverFacade?: ServerFacade) {
    this.serverFacade = serverFacade ?? new ServerFacade();
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const token = authToken.token;
    const item = lastItem == null ? null : lastItem.dto;
    const response: PagedUserItemRequest = {
      token,
      userAlias,
      pageSize,
      lastItem: item,
    };
    return await this.serverFacade.getMoreFollowees(response);
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const token = authToken.token;
    const item = lastItem == null ? null : lastItem.dto;
    const response: PagedUserItemRequest = {
      token,
      userAlias,
      pageSize,
      lastItem: item,
    };
    return await this.serverFacade.getMoreFollowers(response);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const token = authToken.token;
    const _user = user.dto;
    const _selectedUser = selectedUser.dto;
    const request: FollowerStatusRequest = {
      token,
      user: _user,
      selectedUser: _selectedUser,
    };
    const response: FollowerStatusResponse =
      await this.serverFacade.getFollowerStatus(request);

    return response.result;
  }
  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const token = authToken.token;
    const _user = user.dto;
    const request: FollowCountRequest = { token, user: _user };
    const response: FollowCountResponse =
      await this.serverFacade.getFolloweeCount(request);
    return response.count;
  }
  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const token = authToken.token;
    const _user = user.dto;
    const request: FollowCountRequest = { token, user: _user };
    const response: FollowCountResponse =
      await this.serverFacade.getFollowerCount(request);
    return response.count;
  }
  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));
    const token = authToken.token;
    const user = userToFollow.dto;
    const request: FollowActionRequest = { token, user };
    const response: FollowActionResponse = await this.serverFacade.follow(
      request
    );
    return [response.followerCount, response.followeeCount];
  }
  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));
    const token = authToken.token;
    const user = userToUnfollow.dto;
    const request: FollowActionRequest = { token, user };
    const response: FollowActionResponse = await this.serverFacade.unfollow(
      request
    );
    return [response.followerCount, response.followeeCount];
  }
}
