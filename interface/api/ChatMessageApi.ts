import type { ChatApi } from "./ChatApi";
import type { WorkerApi } from "./WorkerApi";
import type { UserApi } from "./UserApi";

export interface ChatMessageApi {
  id: string;
  chat_id: string;
  worker_id: string | null;
  user_id: string | null;
  body: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;

  /** Accessors */

  /** Relations */
  chat: ChatApi | null;
  worker: WorkerApi | null;
  user: UserApi | null;

  /** Texts */
}
