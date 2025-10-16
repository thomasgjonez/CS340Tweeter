import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

interface AppNavbarView {
    displayInfoMessage(message: string, duration?: number): string;
    displayErrorMessage(message: string): void;
    deleteMessage(id: string): void;
    clearUserInfo(): void;
    navigateTo(path: string): void;
  }

export class AppNavbarPresenter {
    private view: AppNavbarView;
    private service: UserService;
  
    public constructor(view: AppNavbarView) {
      this.view = view;
      this.service = new UserService();
    }
  
    public async logOut(authToken: AuthToken): Promise<void> {
      const toastId = this.view.displayInfoMessage("Logging Out...", 0);
  
      try {
        await this.service.logout(authToken);
  
        this.view.deleteMessage(toastId);
        this.view.clearUserInfo();
        this.view.navigateTo("/login");
      } catch (error) {
        this.view.displayErrorMessage(
          `Failed to log user out because of exception: ${error}`
        );
      }
    }
}
  