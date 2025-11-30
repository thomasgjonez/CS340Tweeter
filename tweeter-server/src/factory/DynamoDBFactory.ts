import { AuthTokenDAO } from "../daos/AuthTokenDAO";
import { DynamoAuthTokenDAO } from "../daos/DynamoDAOs/DynamoAuthTokenDAO";
import { DynamoUserDAO } from "../daos/DynamoDAOs/DynamoUserDAO";
import { UserDAO } from "../daos/UserDAO";
import { DAOFactory } from "./DAOFactory";

export class DynamoDBFactory implements DAOFactory {
  makeUserDAO(): UserDAO {
    return new DynamoUserDAO();
  }

  makeAuthTokenDAO(): AuthTokenDAO {
    return new DynamoAuthTokenDAO();
  }
}
