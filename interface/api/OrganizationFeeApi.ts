import type { OrganizationApi } from "./OrganizationApi";

export type PlanCycle =
  | "join"
  | "annual"
  | "biannual"
  | "quarterly"
  | "monthly";

export interface OrganizationFeeApi {
  id: string;
  organization_id: string;
  name: string;
  fee: number;
  is_join_payment: boolean;
  payment_cycle: PlanCycle;
  payment_month: number;
  payment_day: number;
  created_at: string;
  updated_at: string;

  /** Accessors */

  /** Relations */
  organization: OrganizationApi | null;

  /** Texts */
  payment_cycle_text: string;
}
