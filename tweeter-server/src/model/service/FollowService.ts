import { UserDto } from "tweeter-shared";
import { DAOFactory } from "../../factory/DAOFactory";
import { AuthorizationService } from "./AuthorizationService";
import { DataPage } from "../../DataPage";

export class FollowService {
  private DAOFactory: DAOFactory;
  public constructor(DAOFactory: DAOFactory) {
    this.DAOFactory = DAOFactory;
  }
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const authService = new AuthorizationService(this.DAOFactory);
    await authService.requireAuth(token);

    const followDAO = this.DAOFactory.makeFollowDAO();

    return this.getData(
      followDAO.getPageOfFollowees,
      userAlias,
      pageSize,
      lastItem
    );
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const authService = new AuthorizationService(this.DAOFactory);
    await authService.requireAuth(token);

    const followDAO = this.DAOFactory.makeFollowDAO();

    return this.getData(
      followDAO.getPageOfFollowers,
      userAlias,
      pageSize,
      lastItem
    );
  }

  private async getData(
    daoMethod: (
      alias: string,
      pageSize: number,
      lastKey: string | undefined
    ) => Promise<DataPage<[string, string]>>,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const followDAO = this.DAOFactory.makeFollowDAO();
    const userDAO = this.DAOFactory.makeUserDAO();

    const lastKey = lastItem === null ? undefined : lastItem.alias;

    const page = await daoMethod.call(followDAO, userAlias, pageSize, lastKey);

    const results: UserDto[] = [];

    for (const [followerAlias, followeeAlias] of page.values) {
      const targetAlias =
        followerAlias === userAlias ? followeeAlias : followerAlias;

      const user = await userDAO.getUser(targetAlias);
      if (user) {
        results.push(user.dto);
      }
    }

    return [results, page.hasMorePages];
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    const authService = new AuthorizationService(this.DAOFactory);
    const followDAO = this.DAOFactory.makeFollowDAO();
    await authService.requireAuth(token);

    const result = await followDAO.getFollow(userAlias, selectedUserAlias);
    return !!result;
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    const authService = new AuthorizationService(this.DAOFactory);
    const followDAO = this.DAOFactory.makeFollowDAO();
    await authService.requireAuth(token);
    const result = await followDAO.countFollowees(user.alias);
    return result;
    //return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    const authService = new AuthorizationService(this.DAOFactory);
    const followDAO = this.DAOFactory.makeFollowDAO();
    await authService.requireAuth(token);
    const result = await followDAO.countFollowers(user.alias);
    return result;
    // return FakeData.instance.getFollowerCount(user.alias);
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const authService = new AuthorizationService(this.DAOFactory);
    const followDAO = this.DAOFactory.makeFollowDAO();
    const loggedInUserAlias = await authService.requireAuth(token);

    const alreadyFollowing = await followDAO.getFollow(
      loggedInUserAlias,
      userToFollow.alias
    );

    if (alreadyFollowing) {
      const followerCount = await this.getFollowerCount(token, userToFollow);
      const followeeCount = await this.getFolloweeCount(token, userToFollow);

      return [followerCount, followeeCount];
    }

    await followDAO.putFollow(loggedInUserAlias, userToFollow.alias);

    let followerCount = await this.getFollowerCount(token, userToFollow);
    let followeeCount = await this.getFolloweeCount(token, userToFollow);

    //to adjust for the latency of the DB
    followerCount += 1;
    followeeCount += 1;
    return [followerCount, followeeCount];
  }
  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const authService = new AuthorizationService(this.DAOFactory);
    const followDAO = this.DAOFactory.makeFollowDAO();
    const loggedInUserAlias = await authService.requireAuth(token);

    const alreadyFollowing = await followDAO.getFollow(
      loggedInUserAlias,
      userToUnfollow.alias
    );

    if (!alreadyFollowing) {
      const followerCount = await this.getFollowerCount(token, userToUnfollow);
      const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

      return [followerCount, followeeCount];
    }

    await followDAO.deleteFollow(loggedInUserAlias, userToUnfollow.alias);

    let followerCount = await this.getFollowerCount(token, userToUnfollow);
    let followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    //to adjust for the latency of the DB
    followerCount -= 1;
    followeeCount -= 1;
    return [followerCount, followeeCount];
  }

  //public async loadMoreFollowees( token: string, userAlias: string, pageSize: number, lastItem: UserDto | null ): Promise<[UserDto[], boolean]> { const authService = new AuthorizationService(this.DAOFactory); await authService.requireAuth(token); return this.getData(lastItem, pageSize, userAlias); } public async loadMoreFollowers( token: string, userAlias: string, pageSize: number, lastItem: UserDto | null ): Promise<[UserDto[], boolean]> { const authService = new AuthorizationService(this.DAOFactory); await authService.requireAuth(token); return this.getData(lastItem, pageSize, userAlias); } private async getData( lastItem: UserDto | null, pageSize: number, userAlias: string ): Promise<[UserDto[], boolean]> { const followDAO = this.DAOFactory.makeFollowDAO(); const [items, hasMore] = followDAO.( User.fromDto(lastItem), pageSize, userAlias ); const dtos = items.map((user) => user.dto); return [dtos, hasMore]; }
}
