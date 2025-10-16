import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

interface PostStatusView {
  setIsLoading(isLoading: boolean): void;
  setPostText(post: string): void;
  displayInfoMessage(message: string, duration?: number): string;
  displayErrorMessage(message: string): void;
  deleteMessage(id: string): void;
}

export class PostStatusPresenter {
  private view: PostStatusView;
  private service: StatusService;

  public constructor(view: PostStatusView) {
    this.view = view;
    this.service = new StatusService();
  }

  public async submitStatus(
    postText: string,
    currentUser: User,
    authToken: AuthToken
  ): Promise<void> {
    if (!postText.trim()) {
      this.view.displayErrorMessage("Cannot post an empty status.");
      return;
    }

    let postingStatusToastId = "";

    try {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0
      );

      const status = new Status(postText, currentUser!, Date.now());

      await this.service.postStatus(authToken!, status);

      this.view.setPostText("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this.view.setIsLoading(false);
    }
  }

  public clearPost(): void {
    this.view.setPostText("");
  }
}
