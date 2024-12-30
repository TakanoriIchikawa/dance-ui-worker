import type { UserApi } from "./UserApi";
import type { Gender } from "@/type/common/Gender";

export interface StudentApi {
  id: string;
  nickname: string | null;
  first_name: string | null;
  last_name: string | null;
  first_name_kana: string | null;
  last_name_kana: string | null;
  image: string | null;
  gender: Gender | null;
  date_of_birth: string | null;
  created_at: string;
  updated_at: string;

  /** Accessors */
  full_name: string | null;

  /** Relations */
  user: UserApi | null;

  /** Texts */
  gender_text: string | null;
}
