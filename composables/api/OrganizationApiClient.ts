import { CrudApiClient } from "./base/CrudApiClient";
import type { OrganizationApi } from "@/interface/api/OrganizationApi";

interface OrganizationApiClientInterface {
  register: (params: any) => Promise<OrganizationApi>;
  temporaryEmail: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<verifyEmailResponse>;
}

export interface verifyEmailResponse {
  email: string;
  is_expiration: boolean;
}

export class OrganizationApiClient
  extends CrudApiClient<OrganizationApi>
  implements OrganizationApiClientInterface
{
  constructor() {
    super("organizations");
  }

  async register(params: any): Promise<OrganizationApi> {
    return await apiFetch<{ data: OrganizationApi }>(`${this.basePath}/register`, { method: "POST", body: params })
      .then((response: { data: OrganizationApi } | undefined) => {
        if (response) {
          return response.data;
        }
        throw new Error();
      })
      .catch((error) => {
        throw this.setErrorResponse(error);
      });
  }

  async temporaryEmail(email: string): Promise<void> {
    return await apiFetch<{ data: null }>(`${this.basePath}/temporary/email`, { method: "POST", body: { email }})
      .then(() => {
        //
      })
      .catch((error) => {
        throw this.setErrorResponse(error);
      });
  }

  async verifyEmail(token: string): Promise<verifyEmailResponse> {
    return await apiFetch<{ data: verifyEmailResponse }>(`${this.basePath}/verify/email?token=${token}`)
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
