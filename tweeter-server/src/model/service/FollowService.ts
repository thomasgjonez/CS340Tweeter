import { UserDto } from "tweeter-shared";
import { DAOFactory } from "../../factory/DAOFactory";
import { AuthorizationService } from "./AuthorizationService";
import { DataPage } from "../../DataPage";

export class FollowService {
  private DAOFactory: DAOFactory;
  private authService: AuthorizationService;

  public constructor(DAOFactory: DAOFactory) {
    this.DAOFactory = DAOFactory;
    this.authService = new AuthorizationService(this.DAOFactory);
  }
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    try {
      await this.authService.requireAuth(token);

      const followDAO = this.DAOFactory.makeFollowDAO();

      return this.getData(
        followDAO.getPageOfFollowees,
        userAlias,
        pageSize,
        lastItem
      );
    } catch (error: any) {
      throw new error(`Failed to load more Followees: ${error.message}`);
    }
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    try {
      await this.authService.requireAuth(token);

      const followDAO = this.DAOFactory.makeFollowDAO();

      return this.getData(
        followDAO.getPageOfFollowers,
        userAlias,
        pageSize,
        lastItem
      );
    } catch (error: any) {
      throw new Error(`Failed to load more Followers: ${error.message}`);
    }
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
    try {
      const followDAO = this.DAOFactory.makeFollowDAO();
      const userDAO = this.DAOFactory.makeUserDAO();

      const lastKey = lastItem === null ? undefined : lastItem.alias;

      const page = await daoMethod.call(
        followDAO,
        userAlias,
        pageSize,
        lastKey
      );

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
    } catch (error: any) {
      throw new Error(`Unable to load page data: ${error.message}`);
    }
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    const followDAO = this.DAOFactory.makeFollowDAO();
    await this.authService.requireAuth(token);

    const result = await followDAO.getFollow(userAlias, selectedUserAlias);
    return !!result;
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    const followDAO = this.DAOFactory.makeFollowDAO();
    await this.authService.requireAuth(token);
    const result = await followDAO.countFollowees(user.alias);
    return result;
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    const followDAO = this.DAOFactory.makeFollowDAO();
    await this.authService.requireAuth(token);
    const result = await followDAO.countFollowers(user.alias);
    return result;
  }

  public async follow(token: string, user: UserDto): Promise<[number, number]> {
    try {
      return this.updateFollowState(token, user, true);
    } catch (error: any) {
      throw new Error(`Unable to Follow: ${error.message}`);
    }
  }

  public async unfollow(
    token: string,
    user: UserDto
  ): Promise<[number, number]> {
    try {
      return this.updateFollowState(token, user, false);
    } catch (error: any) {
      throw new Error(`Unable to Follow: ${error.message}`);
    }
  }

  private async updateFollowState(
    token: string,
    targetUser: UserDto,
    shouldFollow: boolean
  ): Promise<[number, number]> {
    const authService = new AuthorizationService(this.DAOFactory);
    const followDAO = this.DAOFactory.makeFollowDAO();
    const loggedInUser = await authService.requireAuth(token);

    const relationshipExists = await followDAO.getFollow(
      loggedInUser,
      targetUser.alias
    );

    // follow case
    if (shouldFollow && !relationshipExists) {
      await followDAO.putFollow(loggedInUser, targetUser.alias);
    }

    // unfollow case
    if (!shouldFollow && relationshipExists) {
      await followDAO.deleteFollow(loggedInUser, targetUser.alias);
    }

    const followerCount = await this.getFollowerCount(token, targetUser);
    const followeeCount = await this.getFolloweeCount(token, targetUser);

    return [followerCount, followeeCount];
  }
}
