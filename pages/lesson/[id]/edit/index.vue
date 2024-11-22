<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import type { ErrorResponse } from "@/type/api/ErrorResponse";

const route = useRoute();
const { lesson, find, update } = useLesson();
const { errors } = useErrors();
const { showSnackbar } = useSnackbar();
const { breadcrumbs } = useBreadcrumbs();
const isLoading = ref<boolean>(false);

const lessonId = computed((): string => {
  return String(route.params.id);
});

await useAsyncData("findLessonData", async () => {
  await find(lessonId.value);
  return { lesson: lesson.value };
});

onBeforeMount(() => {
  errors.value = {};
});

if (!lesson.value) {
  throw createError({ statusCode: 404 });
}

const onUpdate = async (params: any) => {
  isLoading.value = true;
  await update(lessonId.value, params)
    .then(() => {
      showSnackbar("レッスンの更新に成功しました", "success");
    })
    .catch((errorResponse: ErrorResponse) => {
      showSnackbar(errorResponse.data.message, "error");
      if (errorResponse.status === 422) {
        const errorMessages = errorResponse.data.errors;
        errors.value.name = errorMessages.name?.[0] ?? "";
        errors.value.description = errorMessages.description?.[0] ?? "";
        errors.value.dayOfWeek = errorMessages.day_of_week?.[0] ?? "";
        errors.value.startTime = errorMessages.start_time?.[0] ?? "";
        errors.value.endTime = errorMessages.end_time?.[0] ?? "";
        errors.value.courseId = errorMessages.course_id?.[0] ?? "";
        errors.value.roomId = errorMessages.room_id?.[0] ?? "";
        errors.value.workerIds = errorMessages.worker_ids?.[0] ?? "";      
      }
    })
    .finally(() => {
      isLoading.value = false;
    });
};

breadcrumbs.value = [
  { title: "ホーム", to: "/" },
  { title: "レッスン", to: "/lesson" },
  { title: lesson.value?.name ?? "", to: `/lesson/${lessonId.value}` },
  { title: "編集", to: `/lesson/${lessonId.value}/edit` },
];
</script>

<template>
  <v-row dense justify="center">
    <v-col cols="12" sm="10" md="10" lg="8" xl="6">
      <v-card>
        <v-card-text>
          <LessonForm :isLoading="isLoading" @save="onUpdate"></LessonForm>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
