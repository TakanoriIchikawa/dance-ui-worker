import { CrudApiClient } from "./base/CrudApiClient";
import type { LessonApi } from "@/interface/api/LessonApi";

interface LessonApiClientInterface {
  //
}

export class LessonApiClient extends CrudApiClient<LessonApi> implements LessonApiClientInterface {
  constructor() { super("lessons") }
}
