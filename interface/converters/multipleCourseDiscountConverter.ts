import type { MultipleCourseDiscountApi } from "@/interface/api/MultipleCourseDiscountApi";
import type { MultipleCourseDiscount } from "@/interface/entities/MultipleCourseDiscount";
import dayjs from "dayjs";

export const convertMultipleCourseDiscountApiToMultipleCourseDiscount = (data: MultipleCourseDiscountApi): MultipleCourseDiscount => {
  return {
    id: data.id,
    organizationId: data.organization_id,
    name: data.name,
    courseCount: data.course_count,
    price: data.price,
    createdAt: dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(data.updated_at).format("YYYY-MM-DD HH:mm:ss"),
  };
};
