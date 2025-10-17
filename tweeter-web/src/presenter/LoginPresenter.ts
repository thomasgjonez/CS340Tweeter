import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

interface LoginView extends AuthenticationView {}

export class LoginPresenter extends AuthenticationPresenter<LoginView> {
  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean
  ): Promise<void> {
    if (!alias || !password) {
      this.view.displayErrorMessage("Alias and password are required");
      return;
    }

    await this.doAuthenticate("log user in", rememberMe, async () =>
      this.service.login(alias, password)
    );
  }
}
