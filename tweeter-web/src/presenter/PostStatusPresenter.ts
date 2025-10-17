import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter } from "./Presenter";

interface PostStatusView extends MessageView {
  setIsLoading(isLoading: boolean): void;
  setPostText(post: string): void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private service: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
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

    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0
      );
      const status = new Status(postText, currentUser!, Date.now());
      await this.service.postStatus(authToken!, status);
      this.view.setPostText("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");
    this.view.deleteMessage(postingStatusToastId);
    this.view.setIsLoading(false);
  }

  public clearPost(): void {
    this.view.setPostText("");
  }
}
