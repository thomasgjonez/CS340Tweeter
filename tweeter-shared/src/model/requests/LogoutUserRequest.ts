import { AuthToken } from "../domain/AuthToken";
import { TweeterRequest } from "./TweeterRequest";

export interface LogoutUserRequest extends TweeterRequest {
  readonly authToken: AuthToken;
}
