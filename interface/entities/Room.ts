import type { Organization } from "./Organization";
import type { Studio } from "./Studio";
import type { Factory } from "./Factory";

export interface Room {
  id: string;
  organizationId: string;
  studioId: string;
  name: string;
  description: string;
  image: string | null;
  capacity: number;
  createdAt: string;
  updatedAt: string;

  /** Accessors */

  /** Relations */
  organization: Organization | null;
  studio: Studio | null;
  factories: Factory[];

  /** Texts */
}
