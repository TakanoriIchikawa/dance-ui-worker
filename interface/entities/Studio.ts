import type { Organization } from "./Organization";
import type { Room } from "./Room";
import type { Course } from "./Course";
import type { Genre } from "./Genre";

export interface Studio {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  image: string | null;
  email: string;
  tel: string;
  postalCode: string;
  prefecture: string;
  city: string;
  town: string;
  building: string;
  createdAt: string;
  updatedAt: string;

  /** Accessors */
  address: string | null;

  /** Relations */
  organization: Organization | null;
  rooms: Room[];
  courses: Course[];
  genres: Genre[];

  /** Texts */
}
