import type { User } from "./User";

export interface Student {
  id: string;
  nickname: string | null;
  firstName: string | null;
  lastName: string | null;
  firstNameKana: string | null;
  lastNameKana: string | null;
  image: string | null;
  gender: "male" | "female" | "other" | null;
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
