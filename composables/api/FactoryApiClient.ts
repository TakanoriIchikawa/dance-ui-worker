import { CrudApiClient } from "./base/CrudApiClient";
import type { FactoryApi } from "@/interface/api/FactoryApi";

interface FactoryApiClientInterface {
  //
}

export class FactoryApiClient extends CrudApiClient<FactoryApi> implements FactoryApiClientInterface {
  constructor() { super("factories") }
}
