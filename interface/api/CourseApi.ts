import type { OrganizationApi } from "./OrganizationApi";
import type { StudioApi } from "./StudioApi";
import type { LessonApi } from "./LessonApi";
import type { WorkerApi } from "./WorkerApi";
import type { StudentApi } from "./StudentApi";
import type { GenreApi } from "./GenreApi";

export interface CourseApi {
  id: string;
  organization_id: string;
  studio_id: string;
  name: string;
  description: string;
  image: string | null;
  created_at: string;
  updated_at: string;

  /** Accessors */

  /** Relations */
  organization: OrganizationApi | null;
  studio: StudioApi | null;
  lessons: LessonApi[];
  workers: WorkerApi[];
  students: StudentApi[];
  genres: GenreApi[];

  /** Texts */
}
