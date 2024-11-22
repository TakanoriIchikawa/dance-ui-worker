import { CourseApiClient } from "./api/CourseApiClient";
import { convertCourseApiToCourse } from "@/interface/converters/courseConverter";
import type { CourseApi } from "@/interface/api/CourseApi";
import type { Course } from "@/interface/entities/Course";
import type { ErrorResponse } from "@/type/api/ErrorResponse";
import type { Paginate } from "@/type/common/Paginate";

const courseApiClient = new CourseApiClient();

export const useCourse = () => {
  const course = useState<Course | null>("course", () => {
    return null;
  });

  const courses = useState<Course[]>("courses", () => {
    return [];
  });

  const { paginate } = usePaginate();

  const fetch = async (params: any): Promise<void> => {
    return courseApiClient.fetch(params).then((data: { paginate: Paginate, data: CourseApi[] }) => {
      paginate.value = data.paginate
      courses.value = data.data.map(convertCourseApiToCourse);
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  };

  const all = async (params: any): Promise<void> => {
    return courseApiClient.all(params).then((data: CourseApi[]) => {
      courses.value = data.map(convertCourseApiToCourse);
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const find = async (id: string): Promise<void> => {
    return courseApiClient.find(id).then((data: CourseApi | null) => {
      course.value = data ? convertCourseApiToCourse(data) : null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const create = async (params: any): Promise<void> => {
    return courseApiClient.create(params).then((data: CourseApi | null) => {
      course.value = data ? convertCourseApiToCourse(data) : null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const update = async (id: string, params: any): Promise<void> => {
    return courseApiClient.update(id, params).then((data: CourseApi | null) => {
      course.value = data ? convertCourseApiToCourse(data) : null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const destroy = async (id: string): Promise<void> => {
    return courseApiClient.destroy(id).then(() => {
      course.value = null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  return {
    course,
    courses,
    fetch,
    all,
    find,
    create,
    update,
    destroy,
  };
};