import { CrudApiClient } from "./base/CrudApiClient";
import type { WorkerApi } from "@/interface/api/WorkerApi";

interface WorkerApiClientInterface {
  invitation: (email: string) => Promise<void>
}

export class WorkerApiClient extends CrudApiClient<WorkerApi> implements WorkerApiClientInterface {
  constructor() { super("workers") }

  async invitation(email: string): Promise<void> {
    return await apiFetch<{ data: null }>(`${this.basePath}/invitation`, { method: "POST", body: { email } })
      .then(() => {
        //
      })
      .catch((error) => {
        throw this.setErrorResponse(error);
      });
  }
}
