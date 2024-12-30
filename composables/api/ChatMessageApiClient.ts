import { CrudApiClient } from "./base/CrudApiClient";
import type { ChatMessageApi } from "@/interface/api/ChatMessageApi";

interface ChatMessageApiClientInterface {
  //
}

export class ChatMessageApiClient extends CrudApiClient<ChatMessageApi> implements ChatMessageApiClientInterface {
  constructor() { super("chat_messages") }
}
