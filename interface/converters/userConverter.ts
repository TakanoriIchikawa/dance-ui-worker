import type { UserApi } from "@/interface/api/UserApi";
import type { User } from "@/interface/entities/User";
import { convertStudentApiToStudent } from "./studentConverter";
import dayjs from "dayjs";

export const convertUserApiToUser = (data: UserApi): User => {
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
    students: data.students ? data.students.map(convertStudentApiToStudent) : [],

    /** Texts */
    genderText: data.gender_text,
  };
};
