import type { StudioApi } from "@/interface/api/StudioApi";
import type { Studio } from "@/interface/entities/Studio";
import { convertOrganizationApiToOrganization } from "./organizationConverter";
import { convertRoomApiToRoom } from "./roomConverter";
import { convertCourseApiToCourse } from "./courseConverter";
import { convertFactoryApiToFactory } from "./factoryConverter";
import { convertGenreApiToGenre } from "./genreConverter";
import dayjs from "dayjs";

export const convertStudioApiToStudio = (data: StudioApi): Studio => {
  return {
    id: data.id,
    organizationId: data.organization_id,
    name: data.name,
    description: data.description,
    image: data.image,
    email: data.email,
    tel: data.tel,
    postalCode: data.postal_code,
    prefecture: data.prefecture,
    city: data.city,
    town: data.town,
    building: data.building,
    createdAt: dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(data.updated_at).format("YYYY-MM-DD HH:mm:ss"),

    /** Accessors */
    address: data.address,

    /** Relations */
    organization: data.organization ? convertOrganizationApiToOrganization(data.organization) : null,
    rooms: data.rooms ? data.rooms.map(convertRoomApiToRoom) : [],
    courses: data.courses ? data.courses.map(convertCourseApiToCourse) : [],
    factories: data.factories ? data.factories.map(convertFactoryApiToFactory) : [],
    genres: data.genres ? data.genres.map(convertGenreApiToGenre) : [],

    /** Texts */
  };
};
