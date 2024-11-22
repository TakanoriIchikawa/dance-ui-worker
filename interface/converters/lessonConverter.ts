import type { LessonApi } from "@/interface/api/LessonApi";
import type { Lesson } from "@/interface/entities/Lesson";
import { convertOrganizationApiToOrganization } from "./organizationConverter";
import { convertCourseApiToCourse } from "./courseConverter";
import { convertRoomApiToRoom } from "./roomConverter";
import { convertWorkerApiToWorker } from "./workerConverter";
import dayjs from "dayjs";

export const convertLessonApiToLesson = (data: LessonApi): Lesson => {
  return {
    id: data.id,
    organizationId: data.organization_id,
    courseId: data.course_id,
    roomId: data.room_id,
    name: data.name,
    description: data.description,
    dayOfWeek: data.day_of_week,
    startTime: data.start_time,
    endTime: data.end_time,
    createdAt: dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(data.updated_at).format("YYYY-MM-DD HH:mm:ss"),

    /** Accessors */

    /** Relations */
    organization: data.organization ? convertOrganizationApiToOrganization(data.organization) : null,
    course: data.course ? convertCourseApiToCourse(data.course) : null,
    room: data.room ? convertRoomApiToRoom(data.room) : null,
    workers: data.workers ? data.workers.map(convertWorkerApiToWorker) : [],

    /** Texts */
    dayOfWeekText: data.day_of_week_text,
  };
};
