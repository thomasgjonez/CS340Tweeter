"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGetHandler = void 0;
async function userGetHandler(event) {
    // try {
    //   const req = JSON.parse(event.body);
    //   const authToken = req.authToken;
    //   const alias = req.alias;
    //   const service = new UserService();
    //   const user = await service.getUser(authToken, alias);
    //   const response: GetUserResponse = {
    //     success: user !== null,
    //     user: user,
    //     message: user ? undefined : "User not found",
    //   };
    //   return {
    //     statusCode: 200,
    //     body: JSON.stringify(response),
    //   };
    // } catch (error) {
    //   console.error("Error in userGetHandler:", error);
    //   const response: GetUserResponse = {
    //     success: false,
    //     user: null,
    //     message: (error as Error).message || "Internal Server Error",
    //   };
    //   return {
    //     statusCode: 500,
    //     body: JSON.stringify(response),
    //   };
    // }
}
exports.userGetHandler = userGetHandler;
