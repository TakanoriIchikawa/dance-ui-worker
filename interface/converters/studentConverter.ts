import type { StudentApi } from "@/interface/api/StudentApi";
import type { Student } from "@/interface/entities/Student";
import { convertUserApiToUser } from "./userConverter";
import dayjs from "dayjs";

export const convertStudentApiToStudent = (data: StudentApi): Student => {
  return {
    id: data.id,
    nickname: data.nickname,
    firstName: data.first_name,
    lastName: data.last_name,
    firstNameKana: data.first_name_kana,
    lastNameKana: data.last_name_kana,
    image: data.image,
    gender: data.gender,
    dateOfBirth: data.date_of_birth ? dayjs(data.date_of_birth).format("YYYY-MM-DD") : null,
    createdAt: dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(data.updated_at).format("YYYY-MM-DD HH:mm:ss"),

    /** Accessors */
    fullName: data.full_name,

    /** Relations */
    user: data.user ? convertUserApiToUser(data.user) : null,

    /** Texts */
    genderText: data.gender_text,
  };
};
