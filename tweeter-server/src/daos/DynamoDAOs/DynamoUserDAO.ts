import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { User } from "tweeter-shared";
import { UserDAO } from "../UserDAO";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoUserDAO implements UserDAO {
  readonly tableName: string = "User_Table";

  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "us-west-2" })
  );

  async createUser(
    firstName: string,
    lastName: string,
    alias: string,
    passwordHash: string,
    imageUrl: string
  ): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Item: {
        firstName,
        lastName,
        alias,
        passwordHash,
        imageUrl,
      },
    };
    await this.client.send(new PutCommand(params));
    return new User(firstName, lastName, alias, imageUrl);
  }
  async getUser(alias: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: { alias },
    };

    const output = await this.client.send(new GetCommand(params));
    return output.Item === undefined
      ? null
      : new User(
          output.Item.firstName,
          output.Item.lastName,
          output.Item.alias,
          output.Item.imageUrl
        );
  }

  async getPasswordHash(alias: string): Promise<string | null> {
    const params = {
      TableName: this.tableName,
      Key: { alias },
    };

    const output = await this.client.send(new GetCommand(params));
    return output.Item === undefined
      ? null
      : output.Item.passwordHash.toString();
  }
}
