import { ChatMessageApiClient } from "./api/ChatMessageApiClient";
import { convertChatMessageApiToChatMessage } from "@/interface/converters/chatMessageConverter";
import type { ChatMessageApi } from "@/interface/api/ChatMessageApi";
import type { ChatMessage } from "@/interface/entities/ChatMessage";
import type { ErrorResponse } from "@/types/api/ErrorResponse";
import type { Paginate } from "@/types/common/Paginate";

const chatMessageApiClient = new ChatMessageApiClient();

export const useChatMessage = () => {
  const chatMessage = useState<ChatMessage | null>("chatMessage", () => {
    return null;
  });

  const chatMessages = useState<ChatMessage[]>("chatMessages", () => {
    return [];
  });

  const { paginate } = usePaginate();

  const fetch = async (params: any, isAdd: boolean = false): Promise<void> => {
    return chatMessageApiClient
      .fetch(params)
      .then((data: { paginate: Paginate; data: ChatMessageApi[] }) => {
        paginate.value = data.paginate;
        if (isAdd) {
          chatMessages.value = [
            ...chatMessages.value,
            ...data.data.map(convertChatMessageApiToChatMessage),
          ];
        } else {
          chatMessages.value = data.data.map(
            convertChatMessageApiToChatMessage
          );
        }
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const all = async (params: any): Promise<void> => {
    return chatMessageApiClient
      .all(params)
      .then((data: ChatMessageApi[]) => {
        chatMessages.value = data.map(convertChatMessageApiToChatMessage);
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const find = async (id: string, isAdd: boolean = false): Promise<void> => {
    return chatMessageApiClient
      .find(id)
      .then((data: ChatMessageApi | null) => {
        chatMessage.value = data
          ? convertChatMessageApiToChatMessage(data)
          : null;
        if (chatMessage.value && isAdd) {
          chatMessages.value = [...chatMessages.value, chatMessage.value];
        }
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const create = async (params: any): Promise<void> => {
    return chatMessageApiClient
      .create(params)
      .then((data: ChatMessageApi | null) => {
        chatMessage.value = data
          ? convertChatMessageApiToChatMessage(data)
          : null;
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const update = async (id: string, params: any): Promise<void> => {
    return chatMessageApiClient
      .update(id, params)
      .then((data: ChatMessageApi | null) => {
        chatMessage.value = data
          ? convertChatMessageApiToChatMessage(data)
          : null;
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const destroy = async (id: string): Promise<void> => {
    return chatMessageApiClient
      .destroy(id)
      .then(() => {
        chatMessage.value = null;
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  return {
    chatMessage,
    chatMessages,
    fetch,
    all,
    find,
    create,
    update,
    destroy,
  };
};
