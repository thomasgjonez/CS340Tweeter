"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
    async getUser(authToken, alias) {
        // TODO: Replace with the result of calling server
        return tweeter_shared_1.FakeData.instance.findUserByAlias(alias);
    }
}
exports.UserService = UserService;
