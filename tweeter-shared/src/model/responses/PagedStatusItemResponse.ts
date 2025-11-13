import { StatusDto } from "../dto/StatusDTO";
import { TweeterResponse } from "./TweeterResponse";

export interface PagedStatusItemResponse extends TweeterResponse {
  readonly items: StatusDto[];
  readonly hasMore: boolean;
}
