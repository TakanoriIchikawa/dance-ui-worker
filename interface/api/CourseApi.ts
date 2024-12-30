import type { OrganizationApi } from "./OrganizationApi";
import type { StudioApi } from "./StudioApi";
import type { LessonApi } from "./LessonApi";
import type { WorkerApi } from "./WorkerApi";
import type { StudentApi } from "./StudentApi";
import type { GenreApi } from "./GenreApi";
import type { MultipleLessonPriceApi } from "./MultipleLessonPriceApi";

export interface CourseApi {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  image: string | null;
  price: number;
  is_multiple_lesson_price: boolean;
  created_at: string;
  updated_at: string;

  /** Accessors */

  /** Relations */
  organization: OrganizationApi | null;
  studios: StudioApi[];
  lessons: LessonApi[];
  workers: WorkerApi[];
  students: StudentApi[];
  genres: GenreApi[];
  multiple_lesson_prices: MultipleLessonPriceApi[];

  /** Texts */
}
