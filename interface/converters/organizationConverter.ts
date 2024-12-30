import type { OrganizationApi } from "@/interface/api/OrganizationApi";
import type { Organization } from "@/interface/entities/Organization";
import { convertOrganizationFeeApiToOrganizationFee } from "./organizationFeeConverter";
import { convertStudioApiToStudio } from "./studioConverter";
import { convertLessonApiToLesson } from "./lessonConverter";
import { convertCourseApiToCourse } from "./courseConverter";
import { convertGenreApiToGenre } from "./genreConverter";
import dayjs from "dayjs";

export const convertOrganizationApiToOrganization = (data: OrganizationApi): Organization => {
  return {
    id: data.id,
    name: data.name,
    nameKana: data.name_kana,
    plan: data.plan,
    planMonthlyFee: data.plan_monthly_fee,
    planStartDate: data.plan_start_date,
    lastName: data.last_name,
    firstName: data.first_name,
    lastNameKana: data.last_name_kana,
    firstNameKana: data.first_name_kana,
    email: data.email,
    tel: data.tel,
    postalCode: data.postal_code,
    prefecture: data.prefecture,
    city: data.city,
    town: data.town,
    building: data.building,
    monthlyPaymentDay: data.monthly_payment_day,
    createdAt: dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(data.updated_at).format("YYYY-MM-DD HH:mm:ss"),

    /** Accessors */
    address: data.address,

    /** Relations */
    organizationFees: data.organization_fees ? data.organization_fees.map(convertOrganizationFeeApiToOrganizationFee) : [],
    studios: data.studios ? data.studios.map(convertStudioApiToStudio) : [],
    courses: data.courses ? data.courses.map(convertCourseApiToCourse) : [],
    lessons: data.lessons ? data.lessons.map(convertLessonApiToLesson) : [],
    genres: data.genres ? data.genres.map(convertGenreApiToGenre) : [],

    /** Texts */
    planText: data.plan_text,
  };
};
