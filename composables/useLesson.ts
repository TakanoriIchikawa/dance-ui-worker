import { LessonApiClient } from "./api/LessonApiClient";
import { convertLessonApiToLesson } from "@/interface/converters/lessonConverter";
import type { LessonApi } from "@/interface/api/LessonApi";
import type { Lesson } from "@/interface/entities/Lesson";
import type { ErrorResponse } from "@/type/api/ErrorResponse";
import type { Paginate } from "@/type/common/Paginate";

const lessonApiClient = new LessonApiClient();

export const useLesson = () => {
  const lesson = useState<Lesson | null>("lesson", () => {
    return null;
  });

  const lessons = useState<Lesson[]>("lessons", () => {
    return [];
  });

  const { paginate } = usePaginate();

  const fetch = async (params: any): Promise<void> => {
    return lessonApiClient.fetch(params).then((data: { paginate: Paginate, data: LessonApi[] }) => {
      paginate.value = data.paginate
      lessons.value = data.data.map(convertLessonApiToLesson);
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  };

  const all = async (params: any): Promise<void> => {
    return lessonApiClient.all(params).then((data: LessonApi[]) => {
      lessons.value = data.map(convertLessonApiToLesson);
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const find = async (id: string): Promise<void> => {
    return lessonApiClient.find(id).then((data: LessonApi | null) => {
      lesson.value = data ? convertLessonApiToLesson(data) : null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const create = async (params: any): Promise<void> => {
    return lessonApiClient.create(params).then((data: LessonApi | null) => {
      lesson.value = data ? convertLessonApiToLesson(data) : null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const update = async (id: string, params: any): Promise<void> => {
    return lessonApiClient.update(id, params).then((data: LessonApi | null) => {
      lesson.value = data ? convertLessonApiToLesson(data) : null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  const destroy = async (id: string): Promise<void> => {
    return lessonApiClient.destroy(id).then(() => {
      lesson.value = null;
    }).catch((errorResponse: ErrorResponse) => {
      throw errorResponse
    })
  }

  return {
    lesson,
    lessons,
    fetch,
    all,
    find,
    create,
    update,
    destroy,
  };
};