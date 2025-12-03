import { StatusDto } from "tweeter-shared";
import { StatusDAO } from "../StatusDAO";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DataPage } from "../../DataPage";

export class DynamoStatusDAO implements StatusDAO {
  private tableName: string;
  private partitionKey: string;

  public constructor(tableName: string, partitionKey: string) {
    this.tableName = tableName;
    this.partitionKey = partitionKey;
  }
  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "us-west-2" })
  );

  async putStoryStatus(status: StatusDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        post: status.post,
        author: status.user.alias,
        timeStamp: status.timestamp,
        segment: status.segments,
        firstName: status.user.firstName,
        lastName: status.user.lastName,
        userImageUrl: status.user.imageURL,
      },
    };

    await this.client.send(new PutCommand(params));
  }

  async putFeedStatus(followerAlias: string, status: StatusDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        alias: followerAlias,
        timeStamp: status.timestamp,
        post: status.post,
        segment: status.segments,
        author: status.user.alias,
        firstName: status.user.firstName,
        lastName: status.user.lastName,
        userImageUrl: status.user.imageURL,
      },
    };

    await this.client.send(new PutCommand(params));
  }

  async getPageOfStatuses(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<DataPage<StatusDto>> {
    console.log(
      "[DynamoStatusDAO.getPageOfStatuses] table:",
      this.tableName,
      "partitionKey:",
      this.partitionKey,
      "userAlias:",
      userAlias,
      "pageSize:",
      pageSize,
      "lastItem:",
      JSON.stringify(lastItem)
    );

    const hasLast = lastItem !== null;

    const params = {
      TableName: this.tableName,
      KeyConditionExpression: hasLast
        ? `${this.partitionKey} = :pk AND #ts < :ts`
        : `${this.partitionKey} = :pk`,
      ExpressionAttributeValues: hasLast
        ? { ":pk": userAlias, ":ts": lastItem.timestamp }
        : { ":pk": userAlias },
      ExpressionAttributeNames: hasLast ? { "#ts": "timeStamp" } : undefined,
      Limit: pageSize,
      ScanIndexForward: false,
    };

    try {
      const output = await this.client.send(new QueryCommand(params));

      const items: StatusDto[] = (output.Items ?? []).map((item) => ({
        post: item.post,
        user: {
          alias: item.author,
          firstName: item.firstName,
          lastName: item.lastName,
          imageURL: item.userImageUrl,
        },
        timestamp: item.timeStamp,
        segments: item.segment,
      }));

      const hasMore = output.LastEvaluatedKey !== undefined;

      return new DataPage(items, hasMore);
    } catch (error: any) {
      throw error;
    }
  }
}
