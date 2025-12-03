import { StatusDto } from "tweeter-shared";
import { DAOFactory } from "../../factory/DAOFactory";
import { AuthorizationService } from "./AuthorizationService";
import { StatusDAO } from "../../daos/StatusDAO";
import { DataPage } from "../../DataPage";

export class StatusService {
  private DAOFactory: DAOFactory;
  private authService: AuthorizationService;

  public constructor(DAOFactory: DAOFactory) {
    this.DAOFactory = DAOFactory;
    this.authService = new AuthorizationService(this.DAOFactory);
  }
  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    try {
      const feedDAO = this.DAOFactory.makeFeedDAO();
      return this.getData(
        token,
        userAlias,
        pageSize,
        lastItem,
        (userAlias, pageSize, lastItem) =>
          feedDAO.getPageOfStatuses(userAlias, pageSize, lastItem)
      );
    } catch (error: any) {
      throw new Error(`Unable to load feed items: ${error.message}`);
    }
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    try {
      const storyDAO = this.DAOFactory.makeStoryDAO();
      return this.getData(
        token,
        userAlias,
        pageSize,
        lastItem,
        (userAlias, pageSize, lastItem) =>
          storyDAO.getPageOfStatuses(userAlias, pageSize, lastItem)
      );
    } catch (error: any) {
      throw new Error(`Unable to load story items: ${error.message}`);
    }
  }

  public async postStatus(
    token: string,
    newStatus: StatusDto
  ): Promise<boolean> {
    try {
      const loggedInUser = await this.authService.requireAuth(token);
      const storyDAO = this.DAOFactory.makeStoryDAO();
      const feedDAO = this.DAOFactory.makeFeedDAO();
      await storyDAO.putStoryStatus(newStatus);

      await this.postToFollowersFeed(loggedInUser, newStatus, feedDAO);
      return true; //returns true if it was succesful as in no errors were thrown
    } catch (error: any) {
      throw new Error(`Unable to post status: ${error.message}`);
    }
  }

  private async getData(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
    daoCall: (
      userAlias: string,
      pageSize: number,
      lastItem: StatusDto | null
    ) => Promise<DataPage<StatusDto>>
  ): Promise<[StatusDto[], boolean]> {
    try {
      await this.authService.requireAuth(token);
      const page = await daoCall(userAlias, pageSize, lastItem);
      return [page.values, page.hasMorePages]; //page.values are the dtos
    } catch (error: any) {
      throw new Error(`Unable to load page data: ${error.message}`);
    }
  }

  private async postToFollowersFeed(
    loggedInUser: string,
    newStatus: StatusDto,
    statusDAO: StatusDAO
  ) {
    try {
      const followDAO = this.DAOFactory.makeFollowDAO();

      const followers = await followDAO.getPageOfFollowers(
        loggedInUser,
        25,
        undefined
      );
      for (const follows of followers.values) {
        const feedStatus: StatusDto = {
          ...newStatus,
          user: newStatus.user,
        };
        await statusDAO.putFeedStatus(follows[0], feedStatus); //follows[0] is the follower or partition key I'll use
      }
    } catch (error: any) {
      throw new Error(`Unable to update follower's feeds: ${error.message}`);
    }
  }
}
