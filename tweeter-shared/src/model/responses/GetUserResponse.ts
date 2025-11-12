import { UserDto } from "../dto/UserDTO";
import { TweeterResponse } from "./TweeterResponse";

export interface GetUserResponse extends TweeterResponse {
  readonly success: boolean;
  readonly user: UserDto | null;
  readonly message?: string;
}
