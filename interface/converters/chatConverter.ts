import type { ChatApi } from "@/interface/api/ChatApi";
import type { Chat } from "@/interface/entities/Chat";
import { convertOrganizationApiToOrganization } from "./organizationConverter";
import { convertChatMessageApiToChatMessage } from "./chatMessageConverter";
import { convertWorkerApiToWorker } from "./workerConverter";
import { convertUserApiToUser } from "./userConverter";
import dayjs from "dayjs";

export const convertChatApiToChat = (data: ChatApi): Chat => {
  return {
    id: data.id,
    organizationId: data.organization_id,
    name: data.name,
    isGroup: data.is_group,
    createdAt: dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(data.updated_at).format("YYYY-MM-DD HH:mm:ss"),

    /** Accessors */

    /** Relations */
    organization: data.organization ? convertOrganizationApiToOrganization(data.organization) : null,
    chatMessages: data.chat_messages ? data.chat_messages.map(convertChatMessageApiToChatMessage) : [],
    workers: data.workers ? data.workers.map(convertWorkerApiToWorker) : [],
    users: data.users ? data.users.map(convertUserApiToUser) : [],

    /** Texts */
  };
};
