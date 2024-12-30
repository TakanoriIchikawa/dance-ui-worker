import type { MultipleLessonPriceApi } from "@/interface/api/MultipleLessonPriceApi";
import type { MultipleLessonPrice } from "@/interface/entities/MultipleLessonPrice";
import dayjs from "dayjs";

export const convertMultipleLessonPriceApiToMultipleLessonPrice = (data: MultipleLessonPriceApi): MultipleLessonPrice => {
  return {
    id: data.id,
    organizationId: data.organization_id,
    courseId: data.course_id,
    name: data.name,
    lessonCount: data.lesson_count,
    price: data.price,
    createdAt: dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(data.updated_at).format("YYYY-MM-DD HH:mm:ss"),
  };
};
