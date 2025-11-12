import { FakeData, User } from "tweeter-shared";

export class UserService {
  public async getUser(authToken: string, alias: string): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  }
}
