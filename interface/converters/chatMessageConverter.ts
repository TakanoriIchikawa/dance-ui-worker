import type { ChatMessageApi } from "@/interface/api/ChatMessageApi";
import type { ChatMessage } from "@/interface/entities/ChatMessage";
import { convertChatApiToChat } from "./chatConverter";
import { convertWorkerApiToWorker } from "./workerConverter";
import { convertUserApiToUser } from "./userConverter";
import dayjs from "dayjs";

export const convertChatMessageApiToChatMessage = (data: ChatMessageApi): ChatMessage => {
  return {
    id: data.id,
    chatId: data.chat_id,
    workerId: data.worker_id,
    userId: data.user_id,
    body: data.body,
    image: data.image,
    createdAt: dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(data.updated_at).format("YYYY-MM-DD HH:mm:ss"),

    /** Accessors */

    /** Relations */
    chat: data.chat ? convertChatApiToChat(data.chat) : null,
    worker: data.worker ? convertWorkerApiToWorker(data.worker) : null,
    user: data.user ? convertUserApiToUser(data.user) : null,

    /** Texts */
  };
};
