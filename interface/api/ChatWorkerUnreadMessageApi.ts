import type { ChatApi } from "./ChatApi";
import type { ChatMessageApi } from "./ChatMessageApi";
import type { WorkerApi } from "./WorkerApi";

export interface ChatWorkerUnreadMessageApi {
  id: string;
  chat_id: string;
  chat_message_id: string;
  worker_id: string;
  created_at: string;
  updated_at: string;

  /** Accessors */

  /** Relations */
  chat: ChatApi | null;
  chat_message: ChatMessageApi | null;
  worker: WorkerApi | null;

  /** Texts */
}
