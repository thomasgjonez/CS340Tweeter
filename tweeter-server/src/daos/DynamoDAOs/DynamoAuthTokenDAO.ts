import { AuthToken } from "tweeter-shared";
import { AuthTokenDAO } from "../AuthTokenDAO";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

export class DynamoAuthTokenDAO implements AuthTokenDAO {
  readonly tableName: string = "AuthToken_Table";

  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "us-west-2" })
  );
  async putToken(alias: string, authToken: AuthToken): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        token: authToken.token,
        alias: alias,
        timeStamp: authToken.timestamp,
      },
    };

    await this.client.send(new PutCommand(params));
  }
  async getToken(token: string): Promise<[AuthToken, string] | null> {
    const params = {
      TableName: this.tableName,
      Key: { token },
    };
    const output = await this.client.send(new GetCommand(params));
    if (!output.Item) return null;

    return [
      new AuthToken(output.Item.token, output.Item.timeStamp),
      output.Item.alias,
    ];
  }
  async deleteToken(token: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { token },
    };
    await this.client.send(new DeleteCommand(params));
  }
}
