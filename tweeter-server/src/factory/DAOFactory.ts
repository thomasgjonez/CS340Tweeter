import { AuthTokenDAO } from "../daos/AuthTokenDAO";
import { FollowDAO } from "../daos/FollowDAO";
import { S3DAO } from "../daos/S3DAO";
import { StatusDAO } from "../daos/StatusDAO";
import { UserDAO } from "../daos/UserDAO";

export interface DAOFactory {
  makeUserDAO(): UserDAO;
  makeAuthTokenDAO(): AuthTokenDAO;
  makeFollowDAO(): FollowDAO;
  makeS3DAO(): S3DAO;
  makeStoryDAO(): StatusDAO;
  makeFeedDAO(): StatusDAO;
}
