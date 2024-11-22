import { CrudApiClient } from "./base/CrudApiClient";
import type { CourseApi } from "@/interface/api/CourseApi";

interface CourseApiClientInterface {
  //
}

export class CourseApiClient extends CrudApiClient<CourseApi> implements CourseApiClientInterface {
  constructor() { super("courses") }
}
