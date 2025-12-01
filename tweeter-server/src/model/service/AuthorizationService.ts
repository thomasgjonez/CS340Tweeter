import { DAOFactory } from "../../factory/DAOFactory";

export class AuthorizationService {
  private static readonly THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  constructor(private factory: DAOFactory) {}

  async requireAuth(tokenString: string): Promise<string> {
    const authDAO = this.factory.makeAuthTokenDAO();

    const result = await authDAO.getToken(tokenString);
    if (!result) {
      throw new Error("401 Unauthorized");
    }

    const [authToken, alias] = result;

    const now = Date.now();
    const age = now - authToken.timestamp;

    if (age > AuthorizationService.THIRTY_DAYS_MS) {
      throw new Error("401 Unauthorized");
    }

    return alias;
  }
}
