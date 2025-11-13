// Domain Classes
export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";

// All classes that should be avaialble to other modules need to exported here. export * does not work when
// uploading to lambda. Instead we have to list each export.
//Dtos
export type { UserDto } from "./model/dto/UserDTO";
export type { StatusDto } from "./model/dto/StatusDTO";
export type { PostSegmentDto } from "./model/dto/PostSegmentDTO";

//Request
export type { PagedUserItemRequest } from "./model/requests/PagedUserItemRequest";
export type { FollowerStatusRequest } from "./model/requests/FollowerStatusRequest";
export type { FollowCountRequest } from "./model/requests/FollowCountRequest";
export type { FollowActionRequest } from "./model/requests/FollowActionRequest";
export type { GetUserRequest } from "./model/requests/GetUserRequest";
export type { CreateUserRequest } from "./model/requests/CreateUserRequest";
export type { LoginUserRequest } from "./model/requests/LoginUserRequest";
export type { LogoutUserRequest } from "./model/requests/LogoutUserRequest";
export type { PagedStatusItemRequest } from "./model/requests/PagedStatusItemRequest";

//Responses
export type { PagedUserItemResponse } from "./model/responses/PagedUserItemResponse";
export type { FollowerStatusResponse } from "./model/responses/FollowerStatusResponse";
export type { FollowCountResponse } from "./model/responses/FollowCountResponse";
export type { FollowActionResponse } from "./model/responses/FollowActionResponse";
export type { GetUserResponse } from "./model/responses/GetUserResponse";
export type { CreateUserResponse } from "./model/responses/CreateUserResponse";
export type { LogoutUserResponse } from "./model/responses/LogoutUserResponse";
export type { PagedStatusItemResponse } from "./model/responses/PagedStatusItemResponse";

//Other

export { FakeData } from "./util/FakeData";
