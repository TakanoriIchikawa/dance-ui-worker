import type { User } from "./User";
import type { Gender } from "@/type/common/Gender";

export interface Student {
  id: string;
  nickname: string | null;
  firstName: string | null;
  lastName: string | null;
  firstNameKana: string | null;
  lastNameKana: string | null;
  image: string | null;
  gender: Gender | null;
  dateOfBirth: string | null;
  createdAt: string;
  updatedAt: string;

  /** Accessors */
  fullName: string | null;

  /** Relations */
  user: User | null;

  /** Texts */
  genderText: string | null;
}
