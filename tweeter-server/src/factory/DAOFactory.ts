import { AuthTokenDAO } from "../daos/AuthTokenDAO";
import { UserDAO } from "../daos/UserDAO";

export interface DAOFactory {
  makeUserDAO(): UserDAO;
  makeAuthTokenDAO(): AuthTokenDAO;
}
