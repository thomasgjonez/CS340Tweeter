import "./UserInfoComponent.css";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./UserHooks";
import { UserInfoPresenter } from "../../presenter/UserInfoPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayErrorMessage, deleteMessage, displayInfoMessage } =
    useMessageActions();

  const { currentUser, authToken, displayedUser } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const location = useLocation();

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  const presenter = new UserInfoPresenter({
    setIsFollower,
    setFolloweeCount,
    setFollowerCount,
    setIsLoading,
    displayInfoMessage,
    displayErrorMessage,
    deleteMessage,
    setDisplayedUser,
    navigateTo: (path: string) => navigate(path),
  });

  useEffect(() => {
    if (displayedUser && authToken && currentUser) {
      presenter.initialize(authToken, currentUser, displayedUser);
    }
  }, [displayedUser]);

  const getBaseUrl = (): string => {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };

  if (!displayedUser || !currentUser || !authToken) return <></>;

  return (
    <div className="container">
      <div className="row">
        <div className="col-auto p-3">
          <img
            src={displayedUser.imageUrl}
            className="img-fluid"
            width="100"
            alt="Posting user"
          />
        </div>
        <div className="col p-3">
          {!displayedUser.equals(currentUser) && (
            <p id="returnToLoggedInUser">
              Return to{" "}
              <Link
                to={`./${currentUser.alias}`}
                onClick={(e) => {
                  e.preventDefault();
                  presenter.switchToLoggedInUser(currentUser, getBaseUrl());
                }}
              >
                logged in user
              </Link>
            </p>
          )}
          <h2>
            <b>{displayedUser.name}</b>
          </h2>
          <h3>{displayedUser.alias}</h3>
          <br />
          {followeeCount > -1 && followerCount > -1 && (
            <div>
              Followees: {followeeCount} Followers: {followerCount}
            </div>
          )}
        </div>
        <form>
          {!displayedUser.equals(currentUser) && (
            <div className="form-group">
              {isFollower ? (
                <button
                  id="unFollowButton"
                  className="btn btn-md btn-secondary me-1"
                  type="submit"
                  style={{ width: "6em" }}
                  onClick={(e) => {
                    e.preventDefault();
                    presenter.unfollowDisplayedUser(authToken, displayedUser);
                  }}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <div>Unfollow</div>
                  )}
                </button>
              ) : (
                <button
                  id="followButton"
                  className="btn btn-md btn-primary me-1"
                  type="submit"
                  style={{ width: "6em" }}
                  onClick={(e) => {
                    e.preventDefault();
                    presenter.followDisplayedUser(authToken, displayedUser);
                  }}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <div>Follow</div>
                  )}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserInfo;
