import { Presenter, View } from "./Presenter";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface AuthenticationView extends View {
  setIsLoading: (loading: boolean) => void;
  updateUserInfo: (
    user: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
  navigateTo: (path: string) => void;
}

export abstract class AuthenticationPresenter<
  V extends AuthenticationView
> extends Presenter<V> {
  protected service: UserService;

  public constructor(view: V) {
    super(view);
    this.service = new UserService();
  }

  protected async doAuthenticate(
    operationName: string,
    rememberMe: boolean,
    operation: () => Promise<[User, AuthToken]>
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      const [user, authToken] = await operation();
      this.view.updateUserInfo(user, authToken, rememberMe);
      this.view.navigateTo(`/feed/${user.alias}`);
    }, operationName);

    this.view.setIsLoading(false);
  }
}
