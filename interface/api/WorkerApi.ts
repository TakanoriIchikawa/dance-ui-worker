import type { OrganizationApi } from "./OrganizationApi";
import type { GenreApi } from "./GenreApi";
import type { CourseApi } from "./CourseApi";
import type { LessonApi } from "./LessonApi";
import type { Gender } from "@/type/common/Gender";

export interface WorkerApi {
  id: string;
  organization_id: string;
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
  organization: OrganizationApi | null;
  genres: GenreApi[];
  courses: CourseApi[];
  lessons: LessonApi[];

  /** Texts */
  gender_text: string | null;
}
