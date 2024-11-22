import type { OrganizationApi } from "@/interface/api/OrganizationApi";
import type { Organization } from "@/interface/entities/Organization";
import dayjs from "dayjs";

export const convertOrganizationApiToOrganization = (data: OrganizationApi): Organization => {
  return {
    id: data.id,
    name: data.name,
    createdAt: dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(data.updated_at).format("YYYY-MM-DD HH:mm:ss"),

    /** Accessors */

    /** Relations */

    /** Texts */
  };
};
