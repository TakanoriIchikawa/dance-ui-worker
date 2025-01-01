import type { Organization } from "./Organization";
import type { ChatMessage } from "./ChatMessage";
import type { Worker } from "./Worker";
import type { User } from "./User";

export interface Chat {
  id: string;
  organizationId: string;
  name: string;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;

  /** Accessors */
  unreadCount: number;
  lastMessageAt: string;

  /** Relations */
  organization: Organization | null;
  chatMessages: ChatMessage[];
  workers: Worker[];
  users: User[];

  /** Texts */
}
