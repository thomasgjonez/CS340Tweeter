import { AuthToken } from "../domain/AuthToken";
import { UserDto } from "../dto/UserDTO";
import { TweeterResponse } from "./TweeterResponse";

export interface CreateUserResponse extends TweeterResponse {
  readonly user: UserDto | null;
  readonly authToken: AuthToken | null;
}
