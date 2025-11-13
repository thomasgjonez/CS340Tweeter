import { UserDto } from "../dto/UserDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface FollowCountRequest extends TweeterRequest {
  token: string;
  user: UserDto;
}
