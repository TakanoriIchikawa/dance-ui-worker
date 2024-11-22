import { CrudApiClient } from "./base/CrudApiClient";
import type { WorkerApi } from "@/interface/api/WorkerApi";

interface AuthApiClientInterface {
  register: (params: { email: string, password: string, password_confirmation: string }) => Promise<WorkerApi>;
  login: (params: { email: string, password: string }) => Promise<WorkerApi>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<verifyEmailResponse>;
}

export interface verifyEmailResponse {
  email: string;
  organization_id: string;
  is_expiration: boolean;
}

export class AuthApiClient extends CrudApiClient<WorkerApi> implements AuthApiClientInterface {
  constructor() { super("auth") }

  async register(params: { email: string, password: string, password_confirmation: string }): Promise<WorkerApi> {
    return await apiFetch<{ data: WorkerApi }>(`${this.basePath}/register`, { method: "POST", body: params })
      .then((response: { data: WorkerApi } | undefined) => {
        if (response) {
          return response.data;
        }
        throw new Error();
      })
      .catch((error) => {
        throw this.setErrorResponse(error);
      });
  }

  async login(params: { email: string, password: string }): Promise<WorkerApi> {
    return await apiFetch<{ data: WorkerApi }>(`${this.basePath}/login`, { method: "POST", body: params })
      .then((response: { data: WorkerApi } | undefined) => {
        if (response) {
          return response.data;
        }
        throw new Error();
      })
      .catch((error) => {
        throw this.setErrorResponse(error);
      });
  }

  async logout(): Promise<void> {
    return await apiFetch<{ data: null }>(`${this.basePath}/logout`, { method: "POST", body: {} })
      .then(() => {
        //
      })
      .catch((error) => {
        throw this.setErrorResponse(error);
      });
  }

  async verifyEmail(token: string): Promise<verifyEmailResponse> {
    return await apiFetch<{ data: verifyEmailResponse }>(`${this.basePath}/verify/email`, { method: "POST", body: { token } })
      .then((response: { data: verifyEmailResponse } | undefined) => {
        if (response) {
          return response.data;
        }
        throw new Error();
      })
      .catch((error) => {
        throw this.setErrorResponse(error);
      });
  }
}
