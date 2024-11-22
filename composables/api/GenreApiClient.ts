import { CrudApiClient } from "./base/CrudApiClient";
import type { GenreApi } from "@/interface/api/GenreApi";

interface GenreApiClientInterface {
  //
}

export class GenreApiClient extends CrudApiClient<GenreApi> implements GenreApiClientInterface {
  constructor() { super("genres") }
}
