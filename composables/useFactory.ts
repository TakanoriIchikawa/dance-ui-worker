import { FactoryApiClient } from "./api/FactoryApiClient";
import { convertFactoryApiToFactory } from "@/interface/converters/factoryConverter";
import type { FactoryApi } from "@/interface/api/FactoryApi";
import type { Factory } from "@/interface/entities/Factory";
import type { ErrorResponse } from "@/types/api/ErrorResponse";

const factoryApiClient = new FactoryApiClient();

export const useFactory = () => {
  const factory = useState<Factory | null>("factory", () => {
    return null;
  });

  const factories = useState<Factory[]>("factories", () => {
    return [];
  });

  const all = async (params: any): Promise<void> => {
    return factoryApiClient
      .all(params)
      .then((data: FactoryApi[]) => {
        factories.value = data.map(convertFactoryApiToFactory);
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  return {
    factory,
    factories,
    all,
  };
};
