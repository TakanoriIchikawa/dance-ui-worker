import type { OrganizationApi } from "./OrganizationApi";
import type { ChatMessageApi } from "./ChatMessageApi";
import type { WorkerApi } from "./WorkerApi";
import type { UserApi } from "./UserApi";

export interface ChatApi {
  id: string;
  organization_id: string;
  name: string;
  is_group: boolean;
  created_at: string;
  updated_at: string;

  /** Accessors */

  /** Relations */
  organization: OrganizationApi | null;
  chat_messages: ChatMessageApi[];
  workers: WorkerApi[];
  users: UserApi[];

  /** Texts */
}
