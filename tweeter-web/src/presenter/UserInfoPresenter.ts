import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter } from "./Presenter";

interface UserInfoView extends MessageView {
  setIsFollower(isFollower: boolean): void;
  setFolloweeCount(count: number): void;
  setFollowerCount(count: number): void;
  setIsLoading(isLoading: boolean): void;
  setDisplayedUser(user: User): void;
  navigateTo(path: string): void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: FollowService;
  private toastId: string = "";

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new FollowService();
  }

  public async initialize(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      await Promise.all([
        this.setFollowerStatus(authToken, currentUser, displayedUser),
        this.setFolloweeCount(authToken, displayedUser),
        this.setFollowerCount(authToken, displayedUser),
      ]);
    }, "load user info");
  }

  private async setFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
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
    }, "determine follower status ");
  }

  private async setFollowerCount(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.updateFollowCount(authToken, displayedUser, "follower");
  }

  private async setFolloweeCount(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.updateFollowCount(authToken, displayedUser, "followee");
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.updateFollowStatus(authToken, displayedUser, "follow");
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.updateFollowStatus(authToken, displayedUser, "unfollow");
  }

  public switchToLoggedInUser(currentUser: User, baseUrl: string): void {
    this.view.setDisplayedUser(currentUser);
    this.view.navigateTo(`${baseUrl}/${currentUser.alias}`);
  }

  private async updateFollowStatus(
    authToken: AuthToken,
    displayedUser: User,
    action: "follow" | "unfollow"
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      const verb = action === "follow" ? "Following" : "Unfollowing";
      this.toastId = this.view.displayInfoMessage(
        `${verb} ${displayedUser.name}...`,
        0
      );

      const [followerCount, followeeCount] =
        action === "follow"
          ? await this.service.follow(authToken, displayedUser)
          : await this.service.unfollow(authToken, displayedUser);

      this.view.setIsFollower(action === "follow");
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, `${action} user`);

    this.view.deleteMessage(this.toastId);
    this.toastId = "";
    this.view.setIsLoading(false);
  }
  private async updateFollowCount(
    authToken: AuthToken,
    displayedUser: User,
    type: "follower" | "followee"
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const count =
        type === "follower"
          ? await this.service.getFollowerCount(authToken, displayedUser)
          : await this.service.getFolloweeCount(authToken, displayedUser);

      if (type === "follower") {
        this.view.setFollowerCount(count);
      } else {
        this.view.setFolloweeCount(count);
      }
    }, `get ${type}s count`);
  }
}
