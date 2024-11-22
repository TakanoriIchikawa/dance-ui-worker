import { CrudApiClient } from "./base/CrudApiClient";
import type { RoomApi } from "@/interface/api/RoomApi";

interface RoomApiClientInterface {
  //
}

export class RoomApiClient extends CrudApiClient<RoomApi> implements RoomApiClientInterface {
  constructor() { super("rooms") }
}
