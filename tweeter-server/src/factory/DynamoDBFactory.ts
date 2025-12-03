import { AWSS3DAO } from "../daos/AWSS3DAO";
import { AuthTokenDAO } from "../daos/AuthTokenDAO";
import { DynamoAuthTokenDAO } from "../daos/DynamoDAOs/DynamoAuthTokenDAO";
import { DynamoFollowDAO } from "../daos/DynamoDAOs/DynamoFollowDAO";
import { DynamoStatusDAO } from "../daos/DynamoDAOs/DynamoStatusDAO";
import { DynamoUserDAO } from "../daos/DynamoDAOs/DynamoUserDAO";
import { FollowDAO } from "../daos/FollowDAO";
import { S3DAO } from "../daos/S3DAO";
import { StatusDAO } from "../daos/StatusDAO";
import { UserDAO } from "../daos/UserDAO";
import { DAOFactory } from "./DAOFactory";

export class DynamoDBFactory implements DAOFactory {
  makeUserDAO(): UserDAO {
    return new DynamoUserDAO();
  }

  makeAuthTokenDAO(): AuthTokenDAO {
    return new DynamoAuthTokenDAO();
  }

  makeFollowDAO(): FollowDAO {
    return new DynamoFollowDAO();
  }
  makeS3DAO(): S3DAO {
    return new AWSS3DAO();
  }

  makeStoryDAO(): StatusDAO {
    return new DynamoStatusDAO("Story_Table", "author");
  }

  makeFeedDAO(): StatusDAO {
    return new DynamoStatusDAO("Feed_Table", "alias");
  }
}
