import type { Chat } from "./Chat";
import type { ChatMessage } from "./ChatMessage";
import type { Worker } from "./Worker";

export interface ChatWorkerUnreadMessage {
  id: string;
  chatId: string;
  chatMessageId: string;
  workerId: string;
  createdAt: string;
  updatedAt: string;

  /** Accessors */

  /** Relations */
  chat: Chat | null;
  chatMessage: ChatMessage | null;
  worker: Worker | null;

  /** Texts */
}
