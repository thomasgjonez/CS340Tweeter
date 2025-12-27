import "isomorphic-fetch";
import { ServerFacade } from "../../src/network/ServerFacade";
import {
  CreateUserRequest,
  FollowCountRequest,
  LoginUserRequest,
  PagedUserItemRequest,
  UserDto,
} from "tweeter-shared";

// describe("ServerFacade Integration Tests", () => {
//   const serverFacade = new ServerFacade();

//   const EXISTING_USER = "@AllenAnderson";
//   const VALID_TOKEN = "validtoken";

// test("registers a new user successfully", async () => {
//   const request: CreateUserRequest = {
//     firstName: "Test",
//     lastName: "User",
//     alias: "@testUser",
//     password: "password",
//     userImageBase64: "",
//     imageFileExtension: "",
//   };

//   const response = await serverFacade.register(request);

//   expect(response.success).toBe(true);
//   expect(response.user?.alias).toBe("@allen");
//   expect(response.authToken).toBeDefined();
// });

// test("retrieves followers successfully", async () => {
//   const request: PagedUserItemRequest = {
//     token: VALID_TOKEN,
//     userAlias: EXISTING_USER,
//     pageSize: 10,
//     lastItem: null,
//   };

//   const [followers, hasMore] = await serverFacade.getMoreFollowers(request);

//   expect(Array.isArray(followers)).toBe(true);
//   expect(typeof hasMore).toBe("boolean");
// });

// test("gets following/follower counts successfully", async () => {
//   const user: UserDto = {
//     alias: EXISTING_USER,
//     firstName: "allen",
//     lastName: "anderson",
//     imageURL: "",
//   };
//   const request: FollowCountRequest = { token: VALID_TOKEN, user };

//   const response = await serverFacade.getFolloweeCount(request);

//   expect(response.success).toBe(true);
//   expect(response.count).toBeGreaterThanOrEqual(0);
// });
//});
