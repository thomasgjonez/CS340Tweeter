import { UserDto } from "../dto/UserDTO";

export interface PagedUserItemRequest {
  readonly token: string;
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: UserDto | null;
}
