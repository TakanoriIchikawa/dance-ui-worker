import dayjs from 'dayjs';
import { prefectures } from "@/composables/constants/prefectures";

export const validationRules = () => {
  const requiredRule = (v: any, label: string): boolean | string => {
    return v ? true : `${label}を入力してください`;
  }

  const maxLengthRule = (v: any, maxLength: number, label: string): boolean | string => {
    return (v === null || v === "" || v.length <= maxLength) || `${label}は${maxLength}文字以下で入力してください`;
  };

  const minLengthRule = (v: any, minLength: number, label: string): boolean | string => {
    return (v === null || v === "" || v.length >= minLength) || `${label}は${minLength}文字以上で入力してください`;
  };

  const emailRule = (v: any, label: string): boolean | string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(v) || `有効な${label}を入力してください`;
  };
  
  const telRule = (v: any, label: string): boolean | string => {
    const telRegex = /^[0-9]{10,11}$/;
    return telRegex.test(v) || `有効な${label}を入力してください（10〜11桁の数字）`;
  };

  const passwordRule = (v: any, label: string): boolean | string => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(v) || `${label}は8文字以上で、少なくとも1つの文字と1つの数字を含めてください`;
  };

  const sameRule = (v: any, compareValue: any, label: string, compareLabel: string): boolean | string => {
    return v === compareValue || `${label}は${compareLabel}と一致していません`;
  };

  const urlRule = (v: any): boolean | string => {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(v) || "有効なURLを入力してください";
  };

  const numericRule = (v: any, label: string): boolean | string => {
    return !isNaN(v) || `${label}は数字で入力してください`;
  };

  const positiveNumberRule = (v: any, label: string): boolean | string => {
    return v > 0 || `${label}は正の数で入力してください`;
  };

  const maxNumberRule = (v: any, max: number, label: string): boolean | string => {
    return (v === null || v === "" || v <= max) || `${label}は${max}以下で入力してください`;
  };

  const minNumberRule = (v: any, min: number, label: string): boolean | string => {
    return (v === null || v === "" || v >= min) || `${label}は${min}以上で入力してください`;
  };

  const alphanumericRule = (v: any, label: string): boolean | string => {
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;
    return alphanumericRegex.test(v) || `${label}は半角英数字で入力してください`;
  };

  const asciiRule = (v: any, label: string): boolean | string => {
    const asciiRegex = /^[\x20-\x7E]*$/;
    return asciiRegex.test(v) || `${label}は半角文字で入力してください`;
  }; 

  const hiraganaRule = (v: any, label: string): boolean | string => {
    const hiraganaRegex = /^[ぁ-んー]*$/;
    return hiraganaRegex.test(v) || `${label}はひらがなで入力してください`;
  };

  const kanaRule = (v: any, label: string): boolean | string => {
    const kanaRegex = /^[ァ-ンヴー]*$/;
    return kanaRegex.test(v) || `${label}はカタカナで入力してください`;
  };

  const maxDateRule = (v: any, maxDate: string, label: string): boolean | string => {
    return dayjs(v).isBefore(dayjs(maxDate).add(1, 'day')) || `${label}は${maxDate}以前の日付で入力してください`;
  };

  const minDateRule = (v: any, minDate: string, label: string): boolean | string => {
    return dayjs(v).isAfter(dayjs(minDate).subtract(1, 'day')) || `${label}は${minDate}以降の日付で入力してください`;
  };

  const maxTimeRule = (v: any, maxTime: string, label: string): boolean | string => {
    return dayjs(`1970-01-01T${v}`).isBefore(dayjs(`1970-01-01T${maxTime}`)) || `${label}は${maxTime}以前の時間で入力してください`;
  };

  const minTimeRule = (v: any, minTime: string, label: string): boolean | string => {
    return dayjs(`1970-01-01T${v}`).isAfter(dayjs(`1970-01-01T${minTime}`)) || `${label}は${minTime}以降の時間で入力してください`;
  };

  const prefectureRule = (v: any, label: string): boolean | string => {
    return prefectures.includes(v) || `有効な${label}を選択してください`;
  };

  return {
    requiredRule,
    maxLengthRule,
    minLengthRule,
    emailRule,
    telRule,
    passwordRule,
    sameRule,
    urlRule,
    numericRule,
    positiveNumberRule,
    maxNumberRule,
    minNumberRule,
    alphanumericRule,
    asciiRule,
    hiraganaRule,
    kanaRule,
    maxDateRule,
    minDateRule,
    maxTimeRule,
    minTimeRule,
    prefectureRule,
  };
}