// import { AuthToken } from "tweeter-shared";
// import {
//   AppNavbarPresenter,
//   AppNavbarView,
// } from "../../src/presenter/AppNavbarPresenter";
// import {
//   mock,
//   instance,
//   verify,
//   anything,
//   spy,
//   when,
// } from "@typestrong/ts-mockito";
// import { UserService } from "../../src/model.service/UserService";

// describe("AppNavbarPresenter", () => {
//   let mockAppNavabarPresenterView: AppNavbarView;
//   let appNavbarPresenter: AppNavbarPresenter;
//   let mockService: UserService;

//   const authToken = new AuthToken("abc123", Date.now());

//   beforeEach(() => {
//     mockAppNavabarPresenterView = mock<AppNavbarView>();
//     const mockAppNavabarPresenterViewInstance = instance(
//       mockAppNavabarPresenterView
//     );
//     when(
//       mockAppNavabarPresenterView.displayInfoMessage(anything(), 0)
//     ).thenReturn("mesageId123");

//     const appNavbarPresenterSpy = spy(
//       new AppNavbarPresenter(mockAppNavabarPresenterViewInstance)
//     );
//     appNavbarPresenter = instance(appNavbarPresenterSpy);

//     mockService = mock<UserService>();

//     when(appNavbarPresenterSpy.service).thenReturn(instance(mockService));
//   });
//   it("tells the view to display a logging out message", async () => {
//     await appNavbarPresenter.logOut(authToken);
//     verify(mockAppNavabarPresenterView.displayInfoMessage(anything(), 0)).once;
//   });

//   it("calls logout on the user service with the correct auth token", async () => {
//     await appNavbarPresenter.logOut(authToken);
//     verify(mockService.logout(authToken)).once;
//   });

//   it("tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page when successful", async () => {
//     await appNavbarPresenter.logOut(authToken);
//     verify(mockAppNavabarPresenterView.deleteMessage("mesageId123")).once;
//     verify(mockAppNavabarPresenterView.clearUserInfo()).once;
//     verify(mockAppNavabarPresenterView.navigateTo("/login")).once;

//     verify(
//       mockAppNavabarPresenterView.displayErrorMessage(
//         `Failed to log user out because of exception: an error occurred`
//       )
//     ).never;
//   });

//   it("the presenter tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page when the login page was unsuccessful", async () => {
//     let error = new Error("error occurred");
//     when(mockService.logout(anything())).thenThrow(error);

//     await appNavbarPresenter.logOut(authToken);

//     // let [errorString] = capture(
//     //   mockAppNavabarPresenterView.displayErrorMessage
//     // ).last();
//     // console.log(errorString);

//     verify(
//       mockAppNavabarPresenterView.displayErrorMessage(
//         `Failed to log user out because of exception: an error occurred`
//       )
//     ).once;
//     verify(mockAppNavabarPresenterView.deleteMessage(anything())).never;
//     verify(mockAppNavabarPresenterView.clearUserInfo()).never;
//     verify(mockAppNavabarPresenterView.navigateTo("/login")).never;
//   });
// });
