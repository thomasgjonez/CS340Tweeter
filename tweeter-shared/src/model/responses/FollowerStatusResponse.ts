import { TweeterResponse } from "./TweeterResponse";

export interface FollowerStatusResponse extends TweeterResponse {
  readonly result: boolean;
}
