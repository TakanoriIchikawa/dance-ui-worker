import type { WorkerApi } from "@/interface/api/WorkerApi";
import type { Worker } from "@/interface/entities/Worker";
import { convertOrganizationApiToOrganization } from "./organizationConverter";
import { convertGenreApiToGenre } from "./genreConverter";
import { convertCourseApiToCourse } from "./courseConverter";
import { convertLessonApiToLesson } from "./lessonConverter";
import dayjs from "dayjs";

export const convertWorkerApiToWorker = (data: WorkerApi): Worker => {
  return {
    id: data.id,
    email: data.email,
    nickname: data.nickname,
    firstName: data.first_name,
    lastName: data.last_name,
    firstNameKana: data.first_name_kana,
    lastNameKana: data.last_name_kana,
    image: data.image,
    gender: data.gender,
    dateOfBirth: data.date_of_birth ? dayjs(data.date_of_birth).format("YYYY-MM-DD") : null,
    tel: data.tel,
    postalCode: data.postal_code,
    prefecture: data.prefecture,
    city: data.city,
    town: data.town,
    building: data.building,
    createdAt: dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(data.updated_at).format("YYYY-MM-DD HH:mm:ss"),

    /** Accessors */
    fullName: data.full_name,
    address: data.address,

    /** Relations */
    organization: data.organization ? convertOrganizationApiToOrganization(data.organization) : null,
    genres: data.genres ? data.genres.map(convertGenreApiToGenre) : [],
    courses: data.courses ? data.courses.map(convertCourseApiToCourse) : [],
    lessons: data.lessons ? data.lessons.map(convertLessonApiToLesson) : [],

    /** Texts */
    genderText: data.gender_text,
  };
};
