import type { Student } from "./Student";
import type { Gender } from "@/types/common/Gender";

export interface User {
  id: string;
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
  students: Student[];

  /** Texts */
  genderText: string | null;
}
