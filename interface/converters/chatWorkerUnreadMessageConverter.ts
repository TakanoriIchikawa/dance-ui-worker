import type { ChatWorkerUnreadMessageApi } from "@/interface/api/ChatWorkerUnreadMessageApi";
import type { ChatWorkerUnreadMessage } from "@/interface/entities/ChatWorkerUnreadMessage";
import { convertChatApiToChat } from "./chatConverter";
import { convertChatMessageApiToChatMessage } from "./chatMessageConverter";
import { convertWorkerApiToWorker } from "./workerConverter";
import dayjs from "dayjs";

export const convertChatWorkerUnreadMessageApiToChatWorkerUnreadMessage = (data: ChatWorkerUnreadMessageApi): ChatWorkerUnreadMessage => {
  return {
    id: data.id,
    chatId: data.chat_id,
    chatMessageId: data.chat_message_id,
    workerId: data.worker_id,
    createdAt: dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(data.updated_at).format("YYYY-MM-DD HH:mm:ss"),

    /** Accessors */

    /** Relations */
    chat: data.chat ? convertChatApiToChat(data.chat) : null,
    chatMessage: data.chat_message ? convertChatMessageApiToChatMessage(data.chat_message) : null,
    worker: data.worker ? convertWorkerApiToWorker(data.worker) : null,

    /** Texts */
  };
};
