import type { Organization } from "./Organization";
import type { Genre } from "./Genre";
import type { Course } from "./Course";
import type { Lesson } from "./Lesson";
import type { Gender } from "@/type/common/Gender";

export interface Worker {
  id: string;
  organizationId: string;
  email: string;
  nickname: string | null;
  firstName: string | null;
  lastName: string | null;
  firstNameKana: string | null;
  lastNameKana: string | null;
  image: string | null;
  gender: Gender | null;
  dateOfBirth: string | null;
  tel: string | null;
  postalCode: string | null;
  prefecture: string | null;
  city: string | null;
  town: string | null;
  building: string | null;
  createdAt: string;
  updatedAt: string;

  /** Accessors */
  fullName: string | null;
  address: string | null;

  /** Relations */
  organization: Organization | null;
  genres: Genre[];
  courses: Course[];
  lessons: Lesson[];

  /** Texts */
  genderText: string | null;
}