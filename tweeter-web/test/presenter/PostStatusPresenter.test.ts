// import { AuthToken, User } from "tweeter-shared";
// import {
//   PostStatusPresenter,
//   PostStatusView,
// } from "../../src/presenter/PostStatusPresenter";
// import {
//   mock,
//   instance,
//   verify,
//   anything,
//   spy,
//   when,
//   anyString,
//   capture,
// } from "@typestrong/ts-mockito";
// import { StatusService } from "../../src/model.service/StatusService";

// describe("PostStatusPresenter integration test", () => {
//   let viewMock: PostStatusView;
//   let view: PostStatusView;
//   let presenter: PostStatusPresenter;

//   const user = new User("Test", "User", "@testuser", "image");
//   const token = new AuthToken("", Date.now());
//   const postText = "Integration test post!";

//   beforeEach(() => {
//     viewMock = mock<PostStatusView>();
//     view = instance(viewMock);

//     // allow view to return a fake toast id
//     when(viewMock.displayInfoMessage("Posting status...", 0)).thenReturn(
//       "toast123"
//     );

//     presenter = new PostStatusPresenter(view);
//   });

//   it("posts a status and shows 'Successfully Posted!'", async () => {
//     await presenter.submitStatus(postText, user, token);

//     // verifies presenter shows the posting message
//     verify(viewMock.displayInfoMessage("Posting status...", 0)).once();

//     // verifies presenter shows the success message
//     verify(viewMock.displayInfoMessage("Status posted!", 2000)).once();
//   });
// });

// describe("PostStatsPresenter", () => {
//   let mockPostStatusPresenterView: PostStatusView;
//   let postStatusPresenter: PostStatusPresenter;
//   let mockService: StatusService;

//   const user = new User("first", "last", "alias", "image_url");
//   const authToken = new AuthToken("abc123", Date.now());
//   const postText = "hello world";

//   beforeEach(() => {
//     mockPostStatusPresenterView = mock<PostStatusView>();
//     const mockPostStatusPresenterViewInstance = instance(
//       mockPostStatusPresenterView
//     );
//     when(
//       mockPostStatusPresenterView.displayInfoMessage(anything(), 0)
//     ).thenReturn("toastId123");

//     const postStatusPresenterSpy = spy(
//       new PostStatusPresenter(mockPostStatusPresenterViewInstance)
//     );
//     postStatusPresenter = instance(postStatusPresenterSpy);

//     mockService = mock<StatusService>();

//     when(postStatusPresenterSpy.service).thenReturn(instance(mockService));
//   });
//   it("tells the view to display a posting status message", async () => {
//     await postStatusPresenter.submitStatus(postText, user, authToken);
//     verify(
//       mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0)
//     ).once();
//   });

//   it("calls postStatus on the post status service with the correct status string and auth token", async () => {
//     await postStatusPresenter.submitStatus(postText, user, authToken);
//     verify(mockService.postStatus(anything(), anything())).once();
//   });

//   it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when successful", async () => {
//     await postStatusPresenter.submitStatus(postText, user, authToken);
//     verify(mockPostStatusPresenterView.deleteMessage(postText)).once;
//     verify(mockPostStatusPresenterView.setPostText("")).once;
//     verify(
//       mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)
//     ).once;

//     verify(mockPostStatusPresenterView.displayErrorMessage(anyString())).never;
//   });

//   it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when unsuccessful", async () => {
//     let error = new Error("error occurred");
//     when(mockService.postStatus(anything(), anything())).thenThrow(error);

//     await postStatusPresenter.submitStatus(postText, user, authToken);

//     // let [errorString] = capture(
//     //   mockPostStatusPresenterView.displayErrorMessage
//     // ).last();
//     // console.log(errorString);

//     verify(
//       mockPostStatusPresenterView.displayErrorMessage(
//         "Failed to post the status because of exception: error occurred"
//       )
//     ).once;
//     verify(mockPostStatusPresenterView.deleteMessage("toastId123")).never;
//     verify(mockPostStatusPresenterView.setPostText("")).never;
//     verify(
//       mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)
//     ).never;
//   });
// });
