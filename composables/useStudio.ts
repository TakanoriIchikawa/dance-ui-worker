import { StudioApiClient } from "./api/StudioApiClient";
import { convertStudioApiToStudio } from "@/interface/converters/studioConverter";
import type { StudioApi } from "@/interface/api/StudioApi";
import type { Studio } from "@/interface/entities/Studio";
import type { ErrorResponse } from "@/types/api/ErrorResponse";
import type { Paginate } from "@/types/common/Paginate";

const studioApiClient = new StudioApiClient();

export const useStudio = () => {
  const studio = useState<Studio | null>("studio", () => {
    return null;
  });

  const studios = useState<Studio[]>("studios", () => {
    return [];
  });

  const { paginate } = usePaginate();

  const fetch = async (params: any): Promise<void> => {
    return studioApiClient
      .fetch(params)
      .then((data: { paginate: Paginate; data: StudioApi[] }) => {
        paginate.value = data.paginate;
        studios.value = data.data.map(convertStudioApiToStudio);
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const all = async (params: any): Promise<void> => {
    return studioApiClient
      .all(params)
      .then((data: StudioApi[]) => {
        studios.value = data.map(convertStudioApiToStudio);
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const find = async (id: string): Promise<void> => {
    return studioApiClient
      .find(id)
      .then((data: StudioApi | null) => {
        studio.value = data ? convertStudioApiToStudio(data) : null;
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const create = async (params: any): Promise<void> => {
    return studioApiClient
      .create(params)
      .then((data: StudioApi | null) => {
        studio.value = data ? convertStudioApiToStudio(data) : null;
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const update = async (id: string, params: any): Promise<void> => {
    return studioApiClient
      .update(id, params)
      .then((data: StudioApi | null) => {
        studio.value = data ? convertStudioApiToStudio(data) : null;
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const destroy = async (id: string): Promise<void> => {
    return studioApiClient
      .destroy(id)
      .then(() => {
        studio.value = null;
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  return {
    studio,
    studios,
    fetch,
    all,
    find,
    create,
    update,
    destroy,
  };
};
