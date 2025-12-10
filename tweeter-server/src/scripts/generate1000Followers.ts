import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs/umd/types";

const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);

const USERS_TABLE = "User_Table";
const FOLLOWS_TABLE = "Follows";

const TARGET_USER_ALIAS = "10000FollowersUser";

async function batchWrite(tableName: string, items: any[]) {
  const batches = [];
  for (let i = 0; i < items.length; i += 25) {
    batches.push(items.slice(i, i + 25));
  }

  for (const batch of batches) {
    const requestItems = batch.map((item) => ({
      PutRequest: { Item: item },
    }));

    await docClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [tableName]: requestItems,
        },
      })
    );
  }
}

async function createTestUsers() {
  const users: any[] = [];
  const passwordHash = await bcrypt.hash("123", 10);

  for (let i = 1; i <= 10000; i++) {
    users.push({
      alias: `TESTUSER${i}`,
      firstName: "TESTUSER",
      lastName: `${i}`,
      imageURL: "",
      passwordHash: passwordHash,
    });
  }

  console.log("Writing 10,000 test users…");
  await batchWrite(USERS_TABLE, users);
  console.log("Finished creating test users");
}

/**
 * STEP 3: Make all TESTUSERs follow the TARGET_USER
 */
async function createFollowers() {
  const follows: any[] = [];

  for (let i = 1; i <= 10000; i++) {
    follows.push({
      follower_alias: `TESTUSER${i}`,
      followee_alias: TARGET_USER_ALIAS,
    });
  }

  console.log("Writing 10,000 follows…");
  await batchWrite(FOLLOWS_TABLE, follows);
  console.log("Finished creating followers");
}

/**
 * MAIN EXECUTION
 */
async function main() {
  console.log("Starting database population…");

  await createTestUsers();
  await createFollowers();

  console.log("All test data created successfully!");
}

main().catch((err) => console.error("Error:", err));
