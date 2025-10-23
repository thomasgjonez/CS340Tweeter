import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthFields from "../authenticationFields/authFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserHooks";
import { LoginPresenter } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const presenterRef = useRef<LoginPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current =
      props.presenter ??
      new LoginPresenter({
        setIsLoading,
        displayErrorMessage,
        updateUserInfo: (user, authToken, remember) =>
          updateUserInfo(user, user, authToken, remember),
        navigateTo: (path: string) => navigate(path),
      });
  }

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      presenterRef.current!.doLogin(alias, password, rememberMe);
    }
  };

  const inputFieldFactory = () => {
    return (
      <>
        <AuthFields
          alias={alias}
          setAlias={setAlias}
          password={password}
          setPassword={setPassword}
          onEnter={loginOnEnter}
        />
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={() => presenterRef.current!.doLogin(alias, password, rememberMe)}
    />
  );
};

export default Login;

// const presenter = props.presenter ?? new LoginPresenter({
//   setIsLoading,
//   displayErrorMessage,
//   updateUserInfo: (user, authToken, remember) =>
//     updateUserInfo(user, user, authToken, remember),
//   navigateTo: (path: string) => navigate(path),
// });
