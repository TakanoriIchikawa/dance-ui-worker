import { CrudApiClient } from "./base/CrudApiClient";
import type { StudioApi } from "@/interface/api/StudioApi";

interface StudioApiClientInterface {
  //
}

export class StudioApiClient extends CrudApiClient<StudioApi> implements StudioApiClientInterface {
  constructor() { super("studios") }
}
