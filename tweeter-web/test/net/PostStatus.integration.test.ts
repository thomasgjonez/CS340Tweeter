import { AuthToken, Status, User } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import { mock, instance, when, verify } from "@typestrong/ts-mockito";
import { UserService } from "../../src/model.service/UserService";
import { StatusService } from "../../src/model.service/StatusService";
import "isomorphic-fetch";

describe("End-to-End Post Status Integration Test", () => {
  const userService = new UserService();
  const statusService = new StatusService();

  const alias = "@ThomasJones";
  const password = "123";

  let viewMock: PostStatusView;
  let presenter: PostStatusPresenter;

  let authToken: AuthToken;
  let user: User;

  beforeAll(async () => {
    // Log in to get real user & real auth token
    const response = await userService.login(alias, password);

    user = response[0];
    authToken = response[1];

    if (!user || !authToken) {
      throw new Error("Unable to login test user.");
    }
  });

  beforeEach(() => {
    viewMock = mock<PostStatusView>();

    // When presenter displays the posting message, return fake toast id
    when(viewMock.displayInfoMessage("Posting status...", 0)).thenReturn(
      "toast123"
    );

    presenter = new PostStatusPresenter(instance(viewMock));
  });

  it("logs in, posts a status, verifies success message, and verifies story updated", async () => {
    await presenter.submitStatus("post", user, authToken);

    verify(viewMock.displayInfoMessage("Status posted!", 2000)).once();

    const [storyItems] = await statusService.loadMoreStoryItems(
      authToken,
      alias,
      20,
      null
    );

    const latestStatus = storyItems[0];

    expect(latestStatus).toBeDefined();
    expect(latestStatus.post).toBe("post");
    expect(latestStatus.user.alias).toBe(alias);
    expect(latestStatus.timestamp).toBeGreaterThan(0);
  });
});
