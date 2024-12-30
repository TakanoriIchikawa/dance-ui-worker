import type { Chat } from "./Chat";
import type { Worker } from "./Worker";
import type { User } from "./User";

export interface ChatMessage {
  id: string;
  chatId: string;
  workerId: string | null;
  userId: string | null;
  body: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;

  /** Accessors */

  /** Relations */
  chat: Chat | null;
  worker: Worker | null;
  user: User | null;

  /** Texts */
}
