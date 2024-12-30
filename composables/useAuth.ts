import { AuthApiClient } from "./api/AuthApiClient";
import { convertWorkerApiToWorker } from "@/interface/converters/workerConverter";
import type { WorkerApi } from "@/interface/api/WorkerApi";
import type { Worker } from "@/interface/entities/Worker";
import type { verifyEmailResponse } from "./api/AuthApiClient";
import type { ErrorResponse } from "@/type/api/ErrorResponse";

const authApiClient = new AuthApiClient();

export const useAuth = () => {
  const auth = useState<Worker | null>("auth", () => {
    return null;
  });

  const register = async (params: { email: string, password: string, password_confirmation: string }): Promise<void> => {
    return authApiClient.register(params).then((data: WorkerApi) => {
      auth.value = convertWorkerApiToWorker(data);
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse;
    });
  };

  const login = async (params: { email: string, password: string, organization_id: string }): Promise<void> => {
    return authApiClient.login(params).then((data: WorkerApi) => {
      auth.value = convertWorkerApiToWorker(data);
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse;
    });
  };

  const logout = async (): Promise<void> => {
    return authApiClient.logout().then(() => {
      auth.value = null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse;
    });
  };

  const update = async (params: any): Promise<void> => {
    return authApiClient.update('account', params).then((data: WorkerApi | null) => {
      auth.value = data ? convertWorkerApiToWorker(data) : null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const destroy = async (): Promise<void> => {
    return authApiClient.destroy('account').then(() => {
      auth.value = null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const verifyEmail = async (token: string): Promise<{ email: string, organizationId: string, isExpiration: boolean }> => {
    return authApiClient.verifyEmail(token).then((data: verifyEmailResponse) => {
      return {
        email: data.email,
        organizationId: data.organization_id,
        isExpiration: data.is_expiration,
      };
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  return {
    auth,
    register,
    login,
    logout,
    update,
    destroy,
    verifyEmail,
  };
};

export const fetchCurrentAuth = async (): Promise<Worker | null> => {
  try {
    const response = await apiFetch<{ data: WorkerApi }>("/auth/account", {});
    if (response) {
      return response.data ? convertWorkerApiToWorker(response.data) : null;
    }
    return null;
  } catch (error: any) {
    if ([401, 419].includes(error?.response?.status)) {
      return null;
    }
    throw error;
  }
};
