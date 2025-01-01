import { CrudApiClient } from "./base/CrudApiClient";
import type { ChatWorkerUnreadMessageApi } from "@/interface/api/ChatWorkerUnreadMessageApi";

interface ChatWorkerUnreadMessageApiClientInterface {
  //
}

export class ChatWorkerUnreadMessageApiClient extends CrudApiClient<ChatWorkerUnreadMessageApi> implements ChatWorkerUnreadMessageApiClientInterface {
  constructor() { super("chat_worker_unread_messages") }

  async destroyAll(params: { chat_id: string }): Promise<void> {
    return await apiFetch<{ data: null }>(`${this.basePath}/all`, { method: "DELETE", body: params })
      .then(() => {
        //
      })
      .catch((error) => {
        throw this.setErrorResponse(error);
      });
  }
}
