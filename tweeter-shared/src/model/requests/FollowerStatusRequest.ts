import { UserDto } from "../dto/UserDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface FollowerStatusRequest extends TweeterRequest {
  readonly token: string;
  readonly user: UserDto;
  readonly selectedUser: UserDto;
}
