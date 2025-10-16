import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";

interface UserInfoView {
  setIsFollower(isFollower: boolean): void;
  setFolloweeCount(count: number): void;
  setFollowerCount(count: number): void;
  setIsLoading(isLoading: boolean): void;
  displayInfoMessage(message: string, duration?: number): string;
  displayErrorMessage(message: string): void;
  deleteMessage(id: string): void;
  setDisplayedUser(user: User): void;
  navigateTo(path: string): void;
}

export class UserInfoPresenter {
  private view: UserInfoView;
  private service: FollowService;

  public constructor(view: UserInfoView) {
    this.view = view;
    this.service = new FollowService();
  }

  public async initialize(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ): Promise<void> {
    try {
      await Promise.all([
        this.setFollowerStatus(authToken, currentUser, displayedUser),
        this.setFolloweeCount(authToken, displayedUser),
        this.setFollowerCount(authToken, displayedUser),
      ]);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to load user info: ${error}`);
    }
  }

  private async setFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ): Promise<void> {
    try {
      if (currentUser.equals(displayedUser)) {
        this.view.setIsFollower(false);
      } else {
        const isFollower = await this.service.getIsFollowerStatus(
          authToken,
          currentUser,
          displayedUser
        );
        this.view.setIsFollower(isFollower);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  private async setFolloweeCount(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    try {
      const count = await this.service.getFolloweeCount(
        authToken,
        displayedUser
      );
      this.view.setFolloweeCount(count);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }

  private async setFollowerCount(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    try {
      const count = await this.service.getFollowerCount(
        authToken,
        displayedUser
      );
      this.view.setFollowerCount(count);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    let toastId = "";
    try {
      this.view.setIsLoading(true);
      toastId = this.view.displayInfoMessage(
        `Following ${displayedUser.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.service.follow(
        authToken,
        displayedUser
      );
      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to follow user: ${error}`);
    } finally {
      this.view.deleteMessage(toastId);
      this.view.setIsLoading(false);
    }
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    let toastId = "";
    try {
      this.view.setIsLoading(true);
      toastId = this.view.displayInfoMessage(
        `Unfollowing ${displayedUser.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.service.unfollow(
        authToken,
        displayedUser
      );
      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to unfollow user: ${error}`);
    } finally {
      this.view.deleteMessage(toastId);
      this.view.setIsLoading(false);
    }
  }

  public switchToLoggedInUser(currentUser: User, baseUrl: string): void {
    this.view.setDisplayedUser(currentUser);
    this.view.navigateTo(`${baseUrl}/${currentUser.alias}`);
  }
}
