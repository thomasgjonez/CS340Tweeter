import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

interface LoginView {
  setIsLoading: (loading: boolean) => void;
  displayErrorMessage: (message: string) => void;
  updateUserInfo: (
    user: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
  navigateTo: (path: string) => void;
}

export class LoginPresenter {
  private view: LoginView;
  private service: UserService;

  public constructor(view: LoginView) {
    this.view = view;
    this.service = new UserService();
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean
  ): Promise<void> {
    if (!alias || !password) {
      this.view.displayErrorMessage("Alias and password are required");
      return;
    }

    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, authToken, rememberMe);
      this.view.navigateTo(`/feed/${user.alias}`);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
