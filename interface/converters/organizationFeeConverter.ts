import type { OrganizationFeeApi } from "@/interface/api/OrganizationFeeApi";
import type { OrganizationFee } from "@/interface/entities/OrganizationFee";
import { convertOrganizationApiToOrganization } from "./organizationConverter";
import dayjs from "dayjs";

export const convertOrganizationFeeApiToOrganizationFee = (data: OrganizationFeeApi): OrganizationFee => {
  return {
    id: data.id,
    organizationId: data.organization_id,
    name: data.name,
    fee: data.fee,
    isJoinPayment: data.is_join_payment,
    paymentCycle: data.payment_cycle,
    paymentMonth: data.payment_month,
    paymentDay: data.payment_day,
    createdAt: dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(data.updated_at).format("YYYY-MM-DD HH:mm:ss"),

    /** Accessors */

    /** Relations */
    organization: data.organization ? convertOrganizationApiToOrganization(data.organization) : null,

    /** Texts */
    paymentCycleText: data.payment_cycle_text,
  };
};
