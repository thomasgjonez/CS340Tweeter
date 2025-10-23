import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import "@testing-library/jest-dom";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import { instance, mock, verify } from "@typestrong/ts-mockito";

library.add(fab);

describe("Login Component", () => {
  it("starts with sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElements("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables sign-in button if both alias and password have text", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");

    await user.type(aliasField, "a");
    await user.type(passwordField, "b");

    expect(signInButton).toBeEnabled;
  });

  it("disables sign-in button if either alias or password is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");

    await user.type(aliasField, "a");
    await user.type(passwordField, "b");
    expect(signInButton).toBeEnabled;

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled;

    await user.type(aliasField, "a");
    expect(signInButton).toBeEnabled;

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled;
  });

  it("calls the presenter's login method with the correct parameters when sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalURL = "url";
    const alias = "alias";
    const password = "password";
    const rememberMe = false;
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements(originalURL, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);

    await user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, rememberMe)).once();
  });
});

function renderLogin(originalURL: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalURL} presenter={presenter}></Login>
      ) : (
        <Login originalUrl={originalURL}></Login>
      )}
    </MemoryRouter>
  );
}
function renderLoginAndGetElements(
  originalURL: string,
  presenter?: LoginPresenter
) {
  const user = userEvent.setup();

  renderLogin(originalURL, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField, user };
}
