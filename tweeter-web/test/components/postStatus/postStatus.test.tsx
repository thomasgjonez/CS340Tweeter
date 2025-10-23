import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import "@testing-library/jest-dom";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { useUserInfo } from "../../../src/components/userInfo/UserHooks";
import { AuthToken, User } from "tweeter-shared";

jest.mock("../../../src/components/userInfo/UserHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

library.add(fab);

describe("PostStatus Component", () => {
  let mockPresenter: PostStatusPresenter;
  let mockPresenterInstance: PostStatusPresenter;

  const mockAuthToken = new AuthToken("abc123", Date.now());
  const mockUser = new User("John", "Doe", "@john", "");
  const postText = "post";

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      authToken: mockAuthToken,
    });
  });

  it("starts with postStatus button disabled", () => {
    const { postStatusButton, clearStatusButton } =
      renderPostStatusAndGetElements();
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("enables postStatus button if both postStatus field has text", async () => {
    const { postStatusButton, clearStatusButton, postField, user } =
      renderPostStatusAndGetElements();

    await user.type(postField, postText);

    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();
  });

  it("both buttons are disabled when the text field is cleared", async () => {
    const { postStatusButton, clearStatusButton, postField, user } =
      renderPostStatusAndGetElements();

    await user.type(postField, postText);

    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();

    await user.clear(postField);
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("calls the presenter's submit Status method with the correct parameters when postStatusButton is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const { postStatusButton, clearStatusButton, postField, user } =
      renderPostStatusAndGetElements(mockPresenterInstance);

    await user.type(postField, postText);

    await user.click(postStatusButton);

    verify(
      mockPresenter.submitStatus(postText, mockUser, mockAuthToken)
    ).once();
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <PostStatus presenter={presenter}></PostStatus>
      ) : (
        <PostStatus></PostStatus>
      )}
    </MemoryRouter>
  );
}
function renderPostStatusAndGetElements(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", {
    name: /postStatusButton/i,
  });
  const clearStatusButton = screen.getByRole("button", {
    name: /clearStatusButton/i,
  });
  const postField = screen.getByLabelText("postStatusTextArea");

  //   const signInButton = screen.getByRole("button", { name: /Sign in/i });
  //   const aliasField = screen.getByLabelText("alias");
  //   const passwordField = screen.getByLabelText("password");

  //   return { signInButton, aliasField, passwordField, user };
  return { postStatusButton, clearStatusButton, postField, user };
}
