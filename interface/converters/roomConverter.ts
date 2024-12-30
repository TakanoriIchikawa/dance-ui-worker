import type { RoomApi } from "@/interface/api/RoomApi";
import type { Room } from "@/interface/entities/Room";
import { convertOrganizationApiToOrganization } from "./organizationConverter";
import { convertStudioApiToStudio } from "./studioConverter";
import { convertFactoryApiToFactory } from "./factoryConverter";
import dayjs from "dayjs";

export const convertRoomApiToRoom = (data: RoomApi): Room => {
  return {
    id: data.id,
    organizationId: data.organization_id,
    studioId: data.studio_id,
    name: data.name,
    description: data.description,
    image: data.image,
    capacity: data.capacity,
    createdAt: dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(data.updated_at).format("YYYY-MM-DD HH:mm:ss"),

    /** Accessors */

    /** Relations */
    organization: data.organization ? convertOrganizationApiToOrganization(data.organization) : null,
    studio: data.studio ? convertStudioApiToStudio(data.studio) : null,
    factories: data.factories ? data.factories.map(convertFactoryApiToFactory) : [],

    /** Texts */
  };
};
