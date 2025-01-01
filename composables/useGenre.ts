import { GenreApiClient } from "./api/GenreApiClient";
import { convertGenreApiToGenre } from "@/interface/converters/genreConverter";
import type { GenreApi } from "@/interface/api/GenreApi";
import type { Genre } from "@/interface/entities/Genre";
import type { ErrorResponse } from "@/types/api/ErrorResponse";

const genreApiClient = new GenreApiClient();

export const useGenre = () => {
  const genre = useState<Genre | null>("genre", () => {
    return null;
  });

  const genres = useState<Genre[]>("genres", () => {
    return [];
  });

  const all = async (params: any): Promise<void> => {
    return genreApiClient
      .all(params)
      .then((data: GenreApi[]) => {
        genres.value = data.map(convertGenreApiToGenre);
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  return {
    genre,
    genres,
    all,
  };
};
