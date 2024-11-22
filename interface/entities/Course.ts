import type { Organization } from "./Organization";
import type { Studio } from "./Studio";
import type { Lesson } from "./Lesson";
import type { Worker } from "./Worker";
import type { Student } from "./Student";
import type { Genre } from "./Genre";

export interface Course {
  id: string;
  organizationId: string;
  studioId: string;
  name: string;
  description: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;

  /** Accessors */

  /** Relations */
  organization: Organization | null;
  studio: Studio | null;
  lessons: Lesson[];
  workers: Worker[];
  students: Student[];
  genres: Genre[];

  /** Texts */
}
