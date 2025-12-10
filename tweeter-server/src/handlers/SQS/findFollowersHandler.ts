import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

import { DynamoDBFactory } from "../../factory/DynamoDBFactory";
import { FollowService } from "../../model/service/FollowService";

const sqs = new SQSClient({});

export const handler = async (event: any): Promise<void> => {
  try {
    for (const record of event.Records) {
      const messageBody = JSON.parse(record.body);

      const dao = new FollowService(new DynamoDBFactory());
      const status = messageBody.status;
      const authorAlias = status.user.alias;

      const followers = await dao.getAllFollowers(authorAlias);

      const chunks = chunkArray(followers, 25);

      for (const group of chunks) {
        await sqs.send(
          new SendMessageCommand({
            QueueUrl: process.env.POPULATE_FEED_QUEUE_URL!,
            MessageBody: JSON.stringify({
              status,
              followers: group,
            }),
          })
        );
      }
    }
  } catch (error) {
    console.error("Error processing FindFollowers event:", error);
    throw error;
  }
};

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
