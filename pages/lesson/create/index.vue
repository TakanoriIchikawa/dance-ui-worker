<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import type { ErrorResponse } from "@/type/api/ErrorResponse";

const router = useRouter();
const { lesson, create } = useLesson();
const { errors } = useErrors();
const { showSnackbar } = useSnackbar();
const { breadcrumbs } = useBreadcrumbs();
const isLoading = ref<boolean>(false);

onBeforeMount(() => {
  lesson.value = null;
  errors.value = {};
});

const onCreate = async (params: any) => {
  isLoading.value = true;
  await create(params)
    .then(() => {
      showSnackbar("レッスンの登録に成功しました", "success");
      router.push("/lesson");
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
  { title: "新規登録", to: "/lesson/create" },
];
</script>

<template>
  <v-row dense justify="center">
    <v-col cols="12" sm="10" md="8" lg="7" xl="6">
      <v-card>
        <v-card-text>
          <LessonForm :isLoading="isLoading" @save="onCreate"></LessonForm>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
