import { ChatApiClient } from "./api/ChatApiClient";
import { convertChatApiToChat } from "@/interface/converters/chatConverter";
import type { ChatApi } from "@/interface/api/ChatApi";
import type { Chat } from "@/interface/entities/Chat";
import type { ErrorResponse } from "@/types/api/ErrorResponse";
import type { Paginate } from "@/types/common/Paginate";

const chatApiClient = new ChatApiClient();

export const useChat = () => {
  const chat = useState<Chat | null>("chat", () => {
    return null;
  });

  const chats = useState<Chat[]>("chats", () => {
    return [];
  });

  const { paginate } = usePaginate();

  const fetch = async (params: any): Promise<void> => {
    return chatApiClient
      .fetch(params)
      .then((data: { paginate: Paginate; data: ChatApi[] }) => {
        paginate.value = data.paginate;
        chats.value = data.data.map(convertChatApiToChat);
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const all = async (params: any): Promise<void> => {
    return chatApiClient
      .all(params)
      .then((data: ChatApi[]) => {
        chats.value = data.map(convertChatApiToChat);
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const find = async (id: string): Promise<void> => {
    return chatApiClient
      .find(id)
      .then((data: ChatApi | null) => {
        chat.value = data ? convertChatApiToChat(data) : null;
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const create = async (params: any): Promise<void> => {
    return chatApiClient
      .create(params)
      .then((data: ChatApi | null) => {
        chat.value = data ? convertChatApiToChat(data) : null;
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const update = async (id: string, params: any): Promise<void> => {
    return chatApiClient
      .update(id, params)
      .then((data: ChatApi | null) => {
        chat.value = data ? convertChatApiToChat(data) : null;
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const destroy = async (id: string): Promise<void> => {
    return chatApiClient
      .destroy(id)
      .then(() => {
        chat.value = null;
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  return {
    chat,
    chats,
    fetch,
    all,
    find,
    create,
    update,
    destroy,
  };
};
