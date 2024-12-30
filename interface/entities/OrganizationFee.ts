import type { Organization } from "./Organization";

export type PlanCycle =
  | "join"
  | "annual"
  | "biannual"
  | "quarterly"
  | "monthly";

export interface OrganizationFee {
  id: string;
  organizationId: string;
  name: string;
  fee: number;
  isJoinPayment: boolean;
  paymentCycle: PlanCycle;
  paymentMonth: number;
  paymentDay: number;
  createdAt: string;
  updatedAt: string;

  /** Accessors */

  /** Relations */
  organization: Organization | null;

  /** Texts */
  paymentCycleText: string;
}
