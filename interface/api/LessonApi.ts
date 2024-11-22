import type { OrganizationApi } from "./OrganizationApi";
import type { CourseApi } from "./CourseApi";
import type { RoomApi } from "./RoomApi";
import type { WorkerApi } from "./WorkerApi";

export interface LessonApi {
  id: string;
  organization_id: string;
  course_id: string;
  room_id: string | null;
  name: string;
  description: string;
  day_of_week: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun" | null;
  start_time: string | null;
  end_time: string | null;
  created_at: string;
  updated_at: string;

  /** Accessors */

  /** Relations */
  organization: OrganizationApi | null;
  course: CourseApi | null;
  room: RoomApi | null;
  workers: WorkerApi[];

  /** Texts */
  day_of_week_text: string | null;
}
