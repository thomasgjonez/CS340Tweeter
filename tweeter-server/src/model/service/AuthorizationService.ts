import { DAOFactory } from "../../factory/DAOFactory";

export class AuthorizationService {
  private static readonly THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  constructor(private factory: DAOFactory) {}

  async requireAuth(tokenString: string): Promise<string> {
    const authDAO = this.factory.makeAuthTokenDAO();

    const token = await authDAO.getToken(tokenString);
    if (!token) {
      throw new Error("401 Unauthorized");
    }

    const now = Date.now();
    const age = now - token.timestamp;

    if (age > AuthorizationService.THIRTY_DAYS_MS) {
      throw new Error("401 Unauthorized");
    }

    return token.token;
  }
}
