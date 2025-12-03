import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { FollowDAO } from "../FollowDAO";
import { DataPage } from "../../DataPage";

export class DynamoFollowDAO implements FollowDAO {
  readonly tableName = "Follows";
  readonly indexName = "Follows_index";

  readonly followerAliasAttr = "follower_alias";
  readonly followeeAliasAttr = "followee_alias";

  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "us-west-2" })
  );

  async putFollow(followerAlias: string, followeeAlias: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followerAliasAttr]: followerAlias,
        [this.followeeAliasAttr]: followeeAlias,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async getFollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<[string, string] | null> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowKey(followerAlias, followeeAlias),
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item === undefined
      ? null
      : [output.Item.followerAliasAttr, output.Item.followeeAliasAttr];
  }

  async deleteFollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowKey(followerAlias, followeeAlias),
    };
    await this.client.send(new DeleteCommand(params));
  }

  async getPageOfFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | undefined
  ): Promise<DataPage<[string, string]>> {
    return this.queryFollowPage(
      this.followeeAliasAttr,
      followeeAlias,
      this.followerAliasAttr,
      lastFollowerAlias,
      pageSize,
      "Follows_index"
    );
  }
  async getPageOfFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | undefined
  ): Promise<DataPage<[string, string]>> {
    return this.queryFollowPage(
      this.followerAliasAttr,
      followerAlias,
      this.followeeAliasAttr,
      lastFolloweeAlias,
      pageSize
    );
  }

  async countFollowees(followerAlias: string): Promise<number> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.followerAliasAttr} = :v`,
      ExpressionAttributeValues: {
        ":v": { S: followerAlias },
      },
    };

    const data = await this.client.send(new QueryCommand(params));

    return data.Items?.length ?? 0;
  }

  async countFollowers(followeeAlias: string): Promise<number> {
    const params = {
      TableName: this.tableName,
      IndexName: "Follows_index",
      KeyConditionExpression: "followee_alias = :v",
      ExpressionAttributeValues: {
        ":v": { S: followeeAlias },
      },
    };

    const data = await this.client.send(new QueryCommand(params));
    return data.Items?.length ?? 0;
  }

  private generateFollowKey(followerAlias: string, followeeAlias: string) {
    return {
      [this.followerAliasAttr]: followerAlias,
      [this.followeeAliasAttr]: followeeAlias,
    };
  }

  private async queryFollowPage(
    keyAttr: string,
    keyValue: string,
    sortAttr: string,
    lastSortValue: string | undefined,
    pageSize: number,
    indexName?: string
  ): Promise<DataPage<[string, string]>> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${keyAttr} = :v`,
      ExpressionAttributeValues: {
        ":v": { S: keyValue },
      },
      Limit: pageSize,
      ...(indexName && { IndexName: indexName }),
      ExclusiveStartKey:
        lastSortValue === undefined
          ? undefined
          : {
              [keyAttr]: { S: keyValue },
              [sortAttr]: { S: lastSortValue },
            },
    };

    const data = await this.client.send(new QueryCommand(params));

    const items: [string, string][] = [];

    data.Items?.forEach((item) => {
      items.push([
        item[this.followerAliasAttr].S!,
        item[this.followeeAliasAttr].S!,
      ]);
    });

    const hasMore = data.LastEvaluatedKey !== undefined;

    return new DataPage(items, hasMore);
  }
}
