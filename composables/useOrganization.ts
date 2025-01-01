import { OrganizationApiClient } from "./api/OrganizationApiClient";
import { convertOrganizationApiToOrganization } from "@/interface/converters/organizationConverter";
import type { OrganizationApi } from "@/interface/api/OrganizationApi";
import type { Organization, Plan } from "@/interface/entities/Organization";
import type { Worker } from "@/interface/entities/Worker";
import type { verifyEmailResponse } from "./api/OrganizationApiClient";
import type { ErrorResponse } from "@/types/api/ErrorResponse";
import type { Token } from "@stripe/stripe-js";

const organizationApiClient = new OrganizationApiClient();

export const useOrganization = () => {
  const organization = useState<Organization | null>("organization", () => {
    return null;
  });

  const organizations = useState<Organization[]>("organizations", () => {
    return [];
  });

  const all = async (params: any): Promise<void> => {
    return organizationApiClient
      .all(params)
      .then((data: OrganizationApi[]) => {
        organizations.value = data.map(convertOrganizationApiToOrganization);
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const find = async (id: string): Promise<void> => {
    return organizationApiClient
      .find(id)
      .then((data: OrganizationApi) => {
        organization.value = convertOrganizationApiToOrganization(data);
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const register = async (params: any): Promise<void> => {
    return organizationApiClient
      .register(params)
      .then((data: OrganizationApi) => {
        organization.value = convertOrganizationApiToOrganization(data);
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const update = async (id: string, params: any): Promise<void> => {
    return organizationApiClient
      .update(id, params)
      .then((data: OrganizationApi) => {
        organization.value = convertOrganizationApiToOrganization(data);
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const destroy = async (id: string): Promise<void> => {
    return organizationApiClient
      .destroy(id)
      .then(() => {
        organization.value = null;
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const temporaryEmail = async (email: string): Promise<void> => {
    return organizationApiClient
      .temporaryEmail(email)
      .then(() => {
        //
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  const verifyEmail = async (
    token: string
  ): Promise<{ email: string; isExpiration: boolean }> => {
    return organizationApiClient
      .verifyEmail(token)
      .then((data: verifyEmailResponse) => {
        return {
          email: data.email,
          isExpiration: data.is_expiration,
        };
      })
      .catch((errorResponse: ErrorResponse) => {
        throw errorResponse;
      });
  };

  return {
    organization,
    organizations,
    all,
    find,
    register,
    update,
    destroy,
    temporaryEmail,
    verifyEmail,
  };
};

export const useOrganizationRegisterInfo = () => {
  const STORAGE_KEY = "organizationRegisterInfo";

  const email = useState<string>("email", () => "");
  const worker = useState<Partial<Worker> | null>("worker", () => null);
  const organization = useState<Partial<Organization> | null>(
    "organization",
    () => null
  );
  const plan = useState<Plan | null>("plan", () => null);
  const cardToken = useState<Token | null>("cardToken", () => null);
  const password = useState<string>("password", () => "");
  const passwordConfirmation = useState<string>(
    "passwordConfirmation",
    () => ""
  );

  if (process.client) {
    const storageValue = localStorage.getItem(STORAGE_KEY);
    if (storageValue) {
      const organizationRegisterInfo = JSON.parse(storageValue);
      email.value = organizationRegisterInfo.email;
      worker.value = organizationRegisterInfo.worker;
      organization.value = organizationRegisterInfo.organization;
      plan.value = organizationRegisterInfo.plan;
    }

    watch(
      [email, worker, organization, plan],
      (newValue) => {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            email: email.value,
            worker: { ...worker.value },
            organization: { ...organization.value },
            plan: plan.value,
          })
        );
      },
      { deep: true }
    );
  }

  const isInputWorker = computed((): boolean => {
    if (!worker.value) {
      return false;
    }
    return !!(
      worker.value.lastName &&
      worker.value.firstName &&
      worker.value.lastNameKana &&
      worker.value.firstNameKana &&
      worker.value.gender &&
      worker.value.dateOfBirth &&
      worker.value.email &&
      worker.value.tel &&
      worker.value.postalCode &&
      worker.value.prefecture &&
      worker.value.city &&
      worker.value.town
    );
  });

  const isInputOrganization = computed((): boolean => {
    if (!organization.value) {
      return false;
    }
    return !!(
      organization.value.name &&
      organization.value.nameKana &&
      organization.value.email &&
      organization.value.tel &&
      organization.value.postalCode &&
      organization.value.prefecture &&
      organization.value.city &&
      organization.value.town
    );
  });

  const isInputPlan = computed((): boolean => {
    return plan.value === "basic" || !!cardToken.value;
  });

  const isInputPassword = computed((): boolean => {
    return !!password.value && !!passwordConfirmation.value;
  });

  const clear = (): void => {
    if (process.client) {
      localStorage.removeItem(STORAGE_KEY);
    }
    email.value = "";
    worker.value = null;
    organization.value = null;
    plan.value = "starter";
    cardToken.value = null;
    password.value = "";
    passwordConfirmation.value = "";
  };

  return {
    email,
    worker,
    organization,
    plan,
    cardToken,
    password,
    passwordConfirmation,
    isInputWorker,
    isInputOrganization,
    isInputPlan,
    isInputPassword,
    clear,
  };
};
