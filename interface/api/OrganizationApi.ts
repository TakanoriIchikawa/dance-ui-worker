import type { OrganizationFeeApi } from "./OrganizationFeeApi";
import type { StudioApi } from "./StudioApi";
import type { CourseApi } from "./CourseApi";
import type { LessonApi } from "./LessonApi";
import type { GenreApi } from "./GenreApi";

export type Plan =
  | "starter"
  | "basic"
  | "standard"
  | "growth"
  | "professional"
  | "premium"
  | "enterprise";

export interface OrganizationApi {
  id: string;
  name: string;
  name_kana: string;
  plan: Plan;
  plan_monthly_fee: number;
  plan_start_date: string;
  last_name: string;
  first_name: string;
  last_name_kana: string;
  first_name_kana: string;
  email: string;
  tel: string;
  postal_code: string;
  prefecture: string;
  city: string;
  town: string;
  building: string;
  monthly_payment_day: number;
  created_at: string;
  updated_at: string;

  /** Accessors */
  address: string | null;

  /** Relations */
  organization_fees: OrganizationFeeApi[];
  studios: StudioApi[];
  courses: CourseApi[];
  lessons: LessonApi[];
  genres: GenreApi[];

  /** Texts */
  plan_text: string;
}
