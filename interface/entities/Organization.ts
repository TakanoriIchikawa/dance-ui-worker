import type { OrganizationFee } from "./OrganizationFee";
import type { Studio } from "./Studio";
import type { Course } from "./Course";
import type { Lesson } from "./Lesson";
import type { Genre } from "./Genre";

export type Plan =
  | "starter"
  | "basic"
  | "standard"
  | "growth"
  | "professional"
  | "premium"
  | "enterprise";

export interface Organization {
  id: string;
  name: string;
  nameKana: string;
  plan: Plan;
  planMonthlyFee: number;
  planStartDate: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  email: string;
  tel: string;
  postalCode: string;
  prefecture: string;
  city: string;
  town: string;
  building: string | null;
  monthlyPaymentDay: number;
  createdAt: string;
  updatedAt: string;

  /** Accessors */
  address: string | null;

  /** Relations */
  organizationFees: OrganizationFee[];
  studios: Studio[];
  courses: Course[];
  lessons: Lesson[];
  genres: Genre[];

  /** Texts */
  planText: string;
} 