import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

interface UserNavigationView {
  navigateTo(path: string): void;
  displayErrorMessage(message: string): void;
  setDisplayedUser(user: User): void;
}

export class UserNavigationPresenter {
  private view: UserNavigationView;
  private featurePath: string;
  private service: UserService;

  public constructor(view: UserNavigationView, featurePath: string) {
    this.view = view;
    this.featurePath = featurePath;
    this.service = new UserService();
  }

  public async navigateToUser(
    event: React.MouseEvent,
    authToken: AuthToken | null,
    displayedUser: User | null
  ): Promise<void> {
    event.preventDefault();

    try {
      if (!authToken) throw new Error("Missing auth token");

      const alias = this.extractAlias(event.target?.toString() ?? "");
      const toUser = await this.service.getUser(authToken, alias);

      if (toUser && (!displayedUser || !toUser.equals(displayedUser))) {
        this.view.setDisplayedUser(toUser);
        this.view.navigateTo(`${this.featurePath}/${toUser.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get user: ${error}`);
    }
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return index >= 0 ? value.substring(index) : value;
  }
}
