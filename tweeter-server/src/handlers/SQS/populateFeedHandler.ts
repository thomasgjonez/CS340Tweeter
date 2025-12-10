import { DynamoDBFactory } from "../../factory/DynamoDBFactory";
import { StatusService } from "../../model/service/StatusService";

const statusService = new StatusService(new DynamoDBFactory());

export const handler = async (event: any) => {
  try {
    for (const record of event.Records) {
      console.log("RAW BODY:", record.body);

      const body = JSON.parse(record.body);

      const status = body.status;
      const followers: string[] = body.followers ?? [];

      console.log("Parsed followers:", followers.length);
      console.log("Status.user.alias:", status.user.alias);

      if (followers.length === 0) {
        console.log("No followers in this chunk — skipping.");
        continue;
      }

      await statusService.fanOutToFollowers(status, followers);
    }
  } catch (error) {
    console.error("Error in PopulateFeedHandler:", error);
    throw error; // Let SQS retry
  }
};
