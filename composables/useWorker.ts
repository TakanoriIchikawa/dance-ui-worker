import { WorkerApiClient } from "./api/WorkerApiClient";
import { convertWorkerApiToWorker } from "@/interface/converters/workerConverter";
import type { WorkerApi } from "@/interface/api/WorkerApi";
import type { Worker } from "@/interface/entities/Worker";
import type { ErrorResponse } from "@/type/api/ErrorResponse";
import type { Paginate } from "@/type/common/Paginate";

const workerApiClient = new WorkerApiClient();

export const useWorker = () => {
  const worker = useState<Worker | null>("worker", () => {
    return null;
  });

  const workers = useState<Worker[]>("workers", () => {
    return [];
  });

  const { paginate } = usePaginate();

  const fetch = async (params: any): Promise<void> => {
    return workerApiClient.fetch(params).then((data: { paginate: Paginate, data: WorkerApi[] }) => {
      paginate.value = data.paginate
      workers.value = data.data.map(convertWorkerApiToWorker);
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  };

  const all = async (params: any): Promise<void> => {
    return workerApiClient.all(params).then((data: WorkerApi[]) => {
      workers.value = data.map(convertWorkerApiToWorker);
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const find = async (id: string): Promise<void> => {
    return workerApiClient.find(id).then((data: WorkerApi | null) => {
      worker.value = data ? convertWorkerApiToWorker(data) : null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const create = async (params: any): Promise<void> => {
    return workerApiClient.create(params).then((data: WorkerApi | null) => {
      worker.value = data ? convertWorkerApiToWorker(data) : null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const update = async (id: string, params: any): Promise<void> => {
    return workerApiClient.update(id, params).then((data: WorkerApi | null) => {
      worker.value = data ? convertWorkerApiToWorker(data) : null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const destroy = async (id: string): Promise<void> => {
    return workerApiClient.destroy(id).then(() => {
      worker.value = null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const invitation = async (email: string): Promise<void> => {
    return workerApiClient.invitation(email).then(() => {
      //
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  return {
    worker,
    workers,
    fetch,
    all,
    find,
    create,
    update,
    destroy,
    invitation,
  };
};