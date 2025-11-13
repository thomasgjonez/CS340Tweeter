import {
  CreateUserRequest,
  FollowActionRequest,
  FollowCountRequest,
  FollowerStatusRequest,
  GetUserRequest,
  LoginUserRequest,
  LogoutUserRequest,
  PagedStatusItemRequest,
  PagedUserItemRequest,
  PostStatusRequest,
  TweeterRequest,
  User,
  UserDto,
  Status,
  StatusDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";
import {
  GetUserResponse,
  PagedUserItemResponse,
  FollowerStatusResponse,
  FollowCountResponse,
  PagedStatusItemResponse,
  PostStatusResponse,
} from "tweeter-shared";
import {
  CreateUserResponse,
  LogoutUserResponse,
  FollowActionResponse,
} from "tweeter-shared";

export class ServerFacade {
  private SERVER_URL =
    "https://q9t6kqh9e2.execute-api.us-west-2.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    return this.clientCommunicator.doPost<GetUserRequest, GetUserResponse>(
      request,
      "/user/get"
    );
  }

  public async register(
    request: CreateUserRequest
  ): Promise<CreateUserResponse> {
    return this.clientCommunicator.doPost<
      CreateUserRequest,
      CreateUserResponse
    >(request, "/user/create");
  }

  public async login(request: LoginUserRequest): Promise<CreateUserResponse> {
    return this.clientCommunicator.doPost<LoginUserRequest, CreateUserResponse>(
      request,
      "/user/login"
    );
  }

  public async logout(request: LogoutUserRequest): Promise<LogoutUserResponse> {
    return this.clientCommunicator.doPost<
      LogoutUserRequest,
      LogoutUserResponse
    >(request, "/user/logout");
  }

  // --- Follow Endpoints ---

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    const items =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    if (response.success && items != null) {
      return [items, response.hasMore];
    } else {
      throw new Error(response.message ?? "Failed to load followees");
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    const items =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    if (response.success && items != null) {
      return [items, response.hasMore];
    } else {
      throw new Error(response.message ?? "Failed to load followers");
    }
  }

  public async getFollowerStatus(
    request: FollowerStatusRequest
  ): Promise<FollowerStatusResponse> {
    return this.clientCommunicator.doPost<
      FollowerStatusRequest,
      FollowerStatusResponse
    >(request, "/follower/status");
  }

  public async getFolloweeCount(
    request: FollowCountRequest
  ): Promise<FollowCountResponse> {
    return this.clientCommunicator.doPost<
      FollowCountRequest,
      FollowCountResponse
    >(request, "/followee/count");
  }

  public async getFollowerCount(
    request: FollowCountRequest
  ): Promise<FollowCountResponse> {
    return this.clientCommunicator.doPost<
      FollowCountRequest,
      FollowCountResponse
    >(request, "/follower/count");
  }

  public async follow(
    request: FollowActionRequest
  ): Promise<FollowActionResponse> {
    return this.clientCommunicator.doPost<
      FollowActionRequest,
      FollowActionResponse
    >(request, "/follow");
  }

  public async unfollow(
    request: FollowActionRequest
  ): Promise<FollowActionResponse> {
    return this.clientCommunicator.doPost<
      FollowActionRequest,
      FollowActionResponse
    >(request, "/unfollow");
  }

  // --- Feed / Story Endpoints ---

  public async getMoreFeedItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/feed/list");

    const items =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    if (response.success && items != null) {
      return [items, response.hasMore];
    } else {
      throw new Error(response.message ?? "Failed to load feed items");
    }
  }

  public async getMoreStoryItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/story/list");

    const items =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    if (response.success && items != null) {
      return [items, response.hasMore];
    } else {
      throw new Error(response.message ?? "Failed to load story items");
    }
  }

  public async postStatus(
    request: PostStatusRequest
  ): Promise<PostStatusResponse> {
    return this.clientCommunicator.doPost<
      PostStatusRequest,
      PostStatusResponse
    >(request, "/status/upload");
  }
}
