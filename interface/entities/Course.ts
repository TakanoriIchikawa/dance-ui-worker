import type { Organization } from "./Organization";
import type { Studio } from "./Studio";
import type { Lesson } from "./Lesson";
import type { Worker } from "./Worker";
import type { Student } from "./Student";
import type { Genre } from "./Genre";
import type { MultipleLessonPrice } from "./MultipleLessonPrice";

export interface Course {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  image: string | null;
  price: number;
  isMultipleLessonPrice: boolean;
  createdAt: string;
  updatedAt: string;

  /** Accessors */

  /** Relations */
  organization: Organization | null;
  studios: Studio[];
  lessons: Lesson[];
  workers: Worker[];
  students: Student[];
  genres: Genre[];
  multipleLessonPrices: MultipleLessonPrice[];

  /** Texts */
}
