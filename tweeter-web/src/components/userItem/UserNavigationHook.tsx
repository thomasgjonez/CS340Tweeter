import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoActions, useUserInfo } from "../userInfo/UserHooks";
import { UserNavigationPresenter } from "../../presenter/UserNavigationPresenter";

export const useUserNavigation = (featurePath: string) => {
  const navigate = useNavigate();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser, authToken } = useUserInfo();
  const { displayErrorMessage } = useMessageActions();

  const presenter = new UserNavigationPresenter(
    {
      navigateTo: (path: string) => navigate(path),
      displayErrorMessage,
      setDisplayedUser,
    },
    featurePath
  );

  return {
    navigateToUser: (event: React.MouseEvent) =>
      presenter.navigateToUser(event, authToken, displayedUser),
  };
};
