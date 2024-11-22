import type { GenreApi } from "@/interface/api/GenreApi";
import type { Genre } from "@/interface/entities/Genre";
import dayjs from "dayjs";

export const convertGenreApiToGenre = (data: GenreApi): Genre => {
  return {
    id: data.id,
    name: data.name,
    color: data.color,
    createdAt: dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(data.updated_at).format("YYYY-MM-DD HH:mm:ss"),

    /** Accessors */

    /** Relations */

    /** Texts */
  };
};
