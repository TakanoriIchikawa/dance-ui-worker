import { RoomApiClient } from "./api/RoomApiClient";
import { convertRoomApiToRoom } from "@/interface/converters/roomConverter";
import type { RoomApi } from "@/interface/api/RoomApi";
import type { Room } from "@/interface/entities/Room";
import type { ErrorResponse } from "@/type/api/ErrorResponse";
import type { Paginate } from "@/type/common/Paginate";

const roomApiClient = new RoomApiClient();

export const useRoom = () => {
  const room = useState<Room | null>("room", () => {
    return null;
  });

  const rooms = useState<Room[]>("rooms", () => {
    return [];
  });

  const { paginate } = usePaginate();

  const fetch = async (params: any): Promise<void> => {
    return roomApiClient.fetch(params).then((data: { paginate: Paginate, data: RoomApi[] }) => {
      paginate.value = data.paginate
      rooms.value = data.data.map(convertRoomApiToRoom);
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  };

  const all = async (params: any): Promise<void> => {
    return roomApiClient.all(params).then((data: RoomApi[]) => {
      rooms.value = data.map(convertRoomApiToRoom);
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const find = async (id: string): Promise<void> => {
    return roomApiClient.find(id).then((data: RoomApi | null) => {
      room.value = data ? convertRoomApiToRoom(data) : null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const create = async (params: any): Promise<void> => {
    return roomApiClient.create(params).then((data: RoomApi | null) => {
      room.value = data ? convertRoomApiToRoom(data) : null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const update = async (id: string, params: any): Promise<void> => {
    return roomApiClient.update(id, params).then((data: RoomApi | null) => {
      room.value = data ? convertRoomApiToRoom(data) : null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const destroy = async (id: string): Promise<void> => {
    return roomApiClient.destroy(id).then(() => {
      room.value = null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  return {
    room,
    rooms,
    fetch,
    all,
    find,
    create,
    update,
    destroy,
  };
};