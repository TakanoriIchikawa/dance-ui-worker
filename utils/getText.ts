import type { Gender } from '@/type/common/Gender'
import type { Plan } from "@/interface/entities/Organization";

export const genderText = (gender: Gender): string => {
  switch (gender) {
    case "male":
      return "男性";
    case "female":
      return "女性";
    case "other":
      return "その他";
    default:
      return "";
  }
};

export const planText = (plan: Plan): string => {
  switch (plan) {
    case "starter":
      return "スタータープラン";
    case "basic":
      return "ベーシック";
    case "standard":
      return "スタンダード";
    case "growth":
      return "グロース";
    case "professional":
      return "プロフェッショナル";
    case "premium":
      return "プレミアム";
    case "enterprise":
      return "エンタープライズ";
    default:
      return "";
  }
};