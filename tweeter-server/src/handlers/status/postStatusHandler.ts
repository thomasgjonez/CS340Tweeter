import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const statusService = new StatusService(new DynamoDBFactory());
const sqs = new SQSClient({});

export const handler = async (
  request: PostStatusRequest
): Promise<PostStatusResponse> => {
  try {
    const result = await statusService.postStatus(
      request.token,
      request.newStatus
    );

    const messageBody = {
      status: request.newStatus,
    };

    await sqs.send(
      new SendMessageCommand({
        QueueUrl: process.env.FIND_FOLLOWERS_QUEUE_URL!,
        MessageBody: JSON.stringify(messageBody),
      })
    );

    return {
      success: result,
      message: "Status was posted",
    };
  } catch (error: any) {
    throw new Error("there was an error in posting status");
  }
};
