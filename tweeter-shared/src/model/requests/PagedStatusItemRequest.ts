import { StatusDto } from "../dto/StatusDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedStatusItemRequest extends TweeterRequest {
  readonly token: string;
  readonly alias: string;
  readonly pageSize: number;
  readonly lastItem: StatusDto | null;
}
