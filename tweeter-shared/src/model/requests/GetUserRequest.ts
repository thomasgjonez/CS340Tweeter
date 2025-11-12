import { TweeterRequest } from "./TweeterRequest";

export interface GetUserRequest extends TweeterRequest {
  readonly authToken: string;
  readonly alias: string;
}
