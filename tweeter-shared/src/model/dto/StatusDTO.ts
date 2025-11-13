import { PostSegmentDto } from "./PostSegmentDTO";
import { UserDto } from "./UserDTO";

export interface StatusDto {
  readonly post: string;
  readonly user: UserDto;
  readonly timestamp: number;
  readonly segments: PostSegmentDto[];
}
