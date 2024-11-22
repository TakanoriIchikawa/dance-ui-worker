import type { CourseApi } from "@/interface/api/CourseApi";
import type { Course } from "@/interface/entities/Course";
import { convertOrganizationApiToOrganization } from "./organizationConverter";
import { convertStudioApiToStudio } from "./studioConverter";
import { convertLessonApiToLesson } from "./lessonConverter";
import { convertWorkerApiToWorker } from "./workerConverter";
import { convertStudentApiToStudent } from "./studentConverter";
import { convertGenreApiToGenre } from "./genreConverter";
import dayjs from "dayjs";

export const convertCourseApiToCourse = (data: CourseApi): Course => {
  return {
    id: data.id,
    organizationId: data.organization_id,
    studioId: data.studio_id,
    name: data.name,
    description: data.description,
    image: data.image,
    createdAt: dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(data.updated_at).format("YYYY-MM-DD HH:mm:ss"),

    /** Accessors */

    /** Relations */
    organization: data.organization ? convertOrganizationApiToOrganization(data.organization) : null,
    studio: data.studio ? convertStudioApiToStudio(data.studio) : null,
    lessons: data.lessons ? data.lessons.map(convertLessonApiToLesson) : [],
    workers: data.workers ? data.workers.map(convertWorkerApiToWorker) : [],
    students: data.students ? data.students.map(convertStudentApiToStudent) : [],
    genres: data.genres ? data.genres.map(convertGenreApiToGenre) : [],

    /** Texts */
  };
};
