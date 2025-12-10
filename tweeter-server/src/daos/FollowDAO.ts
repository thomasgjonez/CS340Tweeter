import { Follow } from "tweeter-shared";
import { DataPage } from "../DataPage";

export interface FollowDAO {
  putFollow(followerAlias: string, followeeAlias: string): Promise<void>;
  getFollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<[string, string] | null>;
  deleteFollow(followerAlias: string, followeeAlias: string): Promise<void>;
  getPageOfFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | undefined
  ): Promise<DataPage<[string, string]>>;
  getPageOfFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | undefined
  ): Promise<DataPage<[string, string]>>;
  countFollowees(followerAlias: string): Promise<number>;
  countFollowers(followeeAlias: string): Promise<number>;
  getAllFollowers(userAlias: string): Promise<string[]>;
}
