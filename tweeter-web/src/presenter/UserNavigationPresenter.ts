import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

interface UserNavigationView extends View {
  navigateTo(path: string): void;
  setDisplayedUser(user: User): void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private featurePath: string;
  private service: UserService;

  public constructor(view: UserNavigationView, featurePath: string) {
    super(view);
    this.featurePath = featurePath;
    this.service = new UserService();
  }

  public async navigateToUser(
    event: React.MouseEvent,
    authToken: AuthToken | null,
    displayedUser: User | null
  ): Promise<void> {
    event.preventDefault();
    await this.doFailureReportingOperation(async () => {
      if (!authToken) throw new Error("Missing auth token");

      const alias = this.extractAlias(event.target?.toString() ?? "");
      const toUser = await this.service.getUser(authToken, alias);

      if (toUser && (!displayedUser || !toUser.equals(displayedUser))) {
        this.view.setDisplayedUser(toUser);
        this.view.navigateTo(`${this.featurePath}/${toUser.alias}`);
      }
    }, "get user");
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return index >= 0 ? value.substring(index) : value;
  }
}
