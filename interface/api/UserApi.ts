import type { StudentApi } from "./StudentApi";
import type { Gender } from "@/types/common/Gender";

export interface UserApi {
  id: string;
  email: string;
  nickname: string | null;
  first_name: string | null;
  last_name: string | null;
  first_name_kana: string | null;
  last_name_kana: string | null;
  image: string | null;
  gender: Gender | null;
  date_of_birth: string | null;
  tel: string | null;
  postal_code: string | null;
  prefecture: string | null;
  city: string | null;
  town: string | null;
  building: string | null;
  created_at: string;
  updated_at: string;

  /** Accessors */
  full_name: string | null;
  address: string | null;

  /** Relations */
  students: StudentApi[];

  /** Texts */
  gender_text: string | null;
}
