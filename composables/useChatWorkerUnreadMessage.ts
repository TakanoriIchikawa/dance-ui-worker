import { ChatWorkerUnreadMessageApiClient } from "./api/ChatWorkerUnreadMessageApiClient";
import { convertChatWorkerUnreadMessageApiToChatWorkerUnreadMessage } from "@/interface/converters/chatWorkerUnreadMessageConverter";
import type { ChatWorkerUnreadMessageApi } from "@/interface/api/ChatWorkerUnreadMessageApi";
import type { ChatWorkerUnreadMessage } from "@/interface/entities/ChatWorkerUnreadMessage";
import type { ErrorResponse } from "@/types/api/ErrorResponse";

const chatWorkerUnreadMessageApiClient = new ChatWorkerUnreadMessageApiClient();

export const useChatWorkerUnreadMessage = () => {
  const chatWorkerUnreadMessage = useState<ChatWorkerUnreadMessage | null>("chatWorkerUnreadMessage", () => {
    return null;
  });

  const chatWorkerUnreadMessages = useState<ChatWorkerUnreadMessage[]>("chatWorkerUnreadMessages", () => {
    return [];
  });

  const all = async (params: any): Promise<void> => {
    return chatWorkerUnreadMessageApiClient
      .all(params)
      .then((data: ChatWorkerUnreadMessageApi[]) => {
        chatWorkerUnreadMessages.value = data.map(convertChatWorkerUnreadMessageApiToChatWorkerUnreadMessage);
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const create = async (params: any): Promise<void> => {
    return chatWorkerUnreadMessageApiClient
      .create(params)
      .then((data: ChatWorkerUnreadMessageApi | null) => {
        chatWorkerUnreadMessage.value = data
          ? convertChatWorkerUnreadMessageApiToChatWorkerUnreadMessage(data)
          : null;
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const destroy = async (id: string): Promise<void> => {
    return chatWorkerUnreadMessageApiClient
      .destroy(id)
      .then(() => {
        chatWorkerUnreadMessage.value = null;
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const destroyAll = async (params: { chat_id: string }): Promise<void> => {
    return chatWorkerUnreadMessageApiClient
      .destroyAll(params)
      .then(() => {
        //
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  return {
    chatWorkerUnreadMessage,
    chatWorkerUnreadMessages,
    all,
    create,
    destroy,
    destroyAll,
  };
};
