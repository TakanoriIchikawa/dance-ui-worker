import { CrudApiClient } from "./base/CrudApiClient";
import type { ChatApi } from "@/interface/api/ChatApi";

interface ChatApiClientInterface {
  //
}

export class ChatApiClient extends CrudApiClient<ChatApi> implements ChatApiClientInterface {
  constructor() { super("chats") }
}
