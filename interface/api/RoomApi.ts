import type { OrganizationApi } from "./OrganizationApi";
import type { StudioApi } from "./StudioApi";

export interface RoomApi {
  id: string;
  organization_id: string;
  studio_id: string;
  name: string;
  description: string;
  image: string | null;
  capacity: number;
  created_at: string;
  updated_at: string;

  /** Accessors */

  /** Relations */
  organization: OrganizationApi | null;
  studio: StudioApi | null;

  /** Texts */
}
