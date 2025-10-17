import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { MessageView, Presenter, View } from "./Presenter";

interface AppNavbarView extends MessageView {
  clearUserInfo(): void;
  navigateTo(path: string): void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  private service: UserService;

  public constructor(view: AppNavbarView) {
    super(view);
    this.service = new UserService();
  }

  public async logOut(authToken: AuthToken): Promise<void> {
    const toastId = this.view.displayInfoMessage("Logging Out...", 0);

    await this.doFailureReportingOperation(async () => {
      await this.service.logout(authToken);

      this.view.deleteMessage(toastId);
      this.view.clearUserInfo();
      this.view.navigateTo("/login");
    }, "log user out");
  }
}
