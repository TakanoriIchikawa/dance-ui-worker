import type { Organization } from "./Organization";
import type { Course } from "./Course";
import type { Room } from "./Room";
import type { Worker } from "./Worker";

export interface Lesson {
  id: string;
  organizationId: string;
  courseId: string;
  roomId: string | null;
  name: string;
  description: string;
  dayOfWeek: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun" | null;
  startTime: string | null;
  endTime: string | null;
  createdAt: string;
  updatedAt: string;

  /** Accessors */

  /** Relations */
  organization: Organization | null;
  course: Course | null;
  room: Room | null;
  workers: Worker[];

  /** Texts */
  dayOfWeekText: string | null;
}
