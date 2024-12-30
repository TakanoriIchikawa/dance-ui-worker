import type { OrganizationApi } from "./OrganizationApi";
import type { RoomApi } from "./RoomApi";
import type { CourseApi } from "./CourseApi";
import type { FactoryApi } from "./FactoryApi";
import type { GenreApi } from "./GenreApi";

export interface StudioApi {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  image: string | null;
  email: string;
  tel: string;
  postal_code: string;
  prefecture: string;
  city: string;
  town: string;
  building: string;
  created_at: string;
  updated_at: string;

  /** Accessors */
  address: string | null;

  /** Relations */
  organization: OrganizationApi | null;
  rooms: RoomApi[];
  courses: CourseApi[];
  factories: FactoryApi[];
  genres: GenreApi[];
}
