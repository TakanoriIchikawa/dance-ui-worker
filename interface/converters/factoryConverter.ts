import type { FactoryApi } from "@/interface/api/FactoryApi";
import type { Factory } from "@/interface/entities/Factory";
import dayjs from "dayjs";

export const convertFactoryApiToFactory = (data: FactoryApi): Factory => {
  return {
    id: data.id,
    name: data.name,
    color: data.color,
    createdAt: dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(data.updated_at).format("YYYY-MM-DD HH:mm:ss"),

    /** Accessors */

    /** Relations */

    /** Pivots */
    pivot: {
      quantity: data.pivot.quantity,
    },

    /** Texts */
  };
};
