import "./PostStatus.css";
import { useRef, useState } from "react";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserHooks";
import { PostStatusPresenter } from "../../presenter/PostStatusPresenter";

interface Props {
  presenter?: PostStatusPresenter;
}

const PostStatus = (props: Props) => {
  const { displayInfoMessage, displayErrorMessage, deleteMessage } =
    useMessageActions();

  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const presenterRef = useRef<PostStatusPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current =
      props.presenter ??
      new PostStatusPresenter({
        setIsLoading,
        setPostText: setPost,
        displayInfoMessage,
        displayErrorMessage,
        deleteMessage,
      });
  }

  const checkButtonStatus: () => boolean = () => {
    return !post.trim() || !authToken || !currentUser;
  };

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          aria-label="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={checkButtonStatus()}
          aria-label="postStatusButton"
          style={{ width: "8em" }}
          onClick={(event) => {
            event.preventDefault();
            presenterRef.current!.submitStatus(post, currentUser!, authToken!);
          }}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={checkButtonStatus()}
          aria-label="clearStatusButton"
          onClick={(event) => {
            event.preventDefault();
            presenterRef.current!.clearPost();
          }}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
