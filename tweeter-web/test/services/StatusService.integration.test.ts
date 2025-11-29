import { StatusService } from "../../src/model.service/StatusService";
import { Status, User } from "tweeter-shared"; // adjust path if needed
import { AuthToken } from "tweeter-shared"; // adjust if needed
import "isomorphic-fetch";

describe("StatusService Integration Test - loadMoreStoryPage", () => {
  let statusService: StatusService;
  const VALID_TOKEN: AuthToken = new AuthToken("token", 123);
  const USER_ALIAS = "@TestUser";

  beforeAll(() => {
    statusService = new StatusService();
  });

  test("Successfully retrieves the first page of a user's story", async () => {
    const [statuses, hasMore] = await statusService.loadMoreStoryItems(
      VALID_TOKEN,
      USER_ALIAS,
      10,
      null
    );

    expect(Array.isArray(statuses)).toBe(true);
    expect(typeof hasMore).toBe("boolean");

    if (statuses.length > 0) {
      for (const status of statuses) {
        expect(status).toBeInstanceOf(Status);

        expect(status.user).toBeInstanceOf(User);
        expect(typeof status.user.alias).toBe("string");
        expect(typeof status.user.firstName).toBe("string");
        expect(typeof status.user.lastName).toBe("string");

        expect(typeof status.post).toBe("string");
        expect(status.timestamp).toBeDefined();
      }
    }
  });

  test("Retrieves the second page when lastItem is provided", async () => {
    const [page1, hasMore] = await statusService.loadMoreStoryItems(
      VALID_TOKEN,
      USER_ALIAS,
      5,
      null
    );

    if (page1.length === 0 || !hasMore) {
      console.warn("Skipping second page test — no more pages or empty page.");
      return;
    }

    const last = page1[page1.length - 1];

    const [page2] = await statusService.loadMoreStoryItems(
      VALID_TOKEN,
      USER_ALIAS,
      5,
      last
    );

    expect(Array.isArray(page2)).toBe(true);

    if (page2.length > 0) {
      expect(page2[0].post).not.toBe(last.post);

      expect(page2[0].user).toBeInstanceOf(User);
      expect(typeof page2[0].user.alias).toBe("string");
    }
  });
});
