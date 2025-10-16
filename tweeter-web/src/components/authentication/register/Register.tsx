import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthFields from "../authenticationFields/authFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserHooks";
import { RegisterPresenter } from "../../../presenter/RegisterPresenter";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFileExtension, setImageFileExtension] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const presenter = new RegisterPresenter({
    setIsLoading,
    displayErrorMessage,
    updateUserInfo: (user, authToken, remember) =>
      updateUserInfo(user, user, authToken, remember),
    navigateTo: (path: string) => navigate(path),
  });

  const checkSubmitButtonStatus = (): boolean => {
    return presenter.isSubmitDisabled(
      firstName,
      lastName,
      alias,
      password,
      imageUrl,
      imageFileExtension
    );
  };

  const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      presenter.doRegister(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension,
        rememberMe
      );
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    presenter.handleImageFile(
      file,
      setImageUrl,
      setImageBytes,
      setImageFileExtension
    );
  };

  const inputFieldFactory = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="firstNameInput"
            placeholder="First Name"
            onKeyDown={registerOnEnter}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <label htmlFor="firstNameInput">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="lastNameInput"
            placeholder="Last Name"
            onKeyDown={registerOnEnter}
            onChange={(event) => setLastName(event.target.value)}
          />
          <label htmlFor="lastNameInput">Last Name</label>
        </div>
        <AuthFields
          alias={alias}
          setAlias={setAlias}
          password={password}
          setPassword={setPassword}
          onEnter={registerOnEnter}
        />
        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onKeyDown={registerOnEnter}
            onChange={handleFileChange}
          />
          {imageUrl.length > 0 && (
            <>
              <label htmlFor="imageFileInput">User Image</label>
              <img src={imageUrl} className="img-thumbnail" alt=""></img>
            </>
          )}
        </div>
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Already registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={() =>
        presenter.doRegister(
          firstName,
          lastName,
          alias,
          password,
          imageBytes,
          imageFileExtension,
          rememberMe
        )
      }
    />
  );
};

export default Register;
