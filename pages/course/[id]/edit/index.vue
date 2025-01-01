<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import type { ErrorResponse } from "@/types/api/ErrorResponse";

const route = useRoute();
const { course, find, update } = useCourse();
const { errors } = useErrors();
const { showSnackbar } = useSnackbar();
const { breadcrumbs } = useBreadcrumbs();
const isLoading = ref<boolean>(false);

const courseId = computed((): string => {
  return String(route.params.id);
});

await useAsyncData("findCourseData", async () => {
  await find(courseId.value);
  return { course: course.value };
});

onBeforeMount(() => {
  errors.value = {};
});

if (!course.value) {
  throw createError({ statusCode: 404 });
}

const onUpdate = async (params: any) => {
  isLoading.value = true;
  await update(courseId.value, params)
    .then(() => {
      showSnackbar("コースの更新に成功しました", "primary");
    })
    .catch((errorResponse: ErrorResponse) => {
      showSnackbar(errorResponse.data.message, "error");
      if (errorResponse.status === 422) {
        const errorMessages = errorResponse.data.errors;
        errors.value.name = errorMessages.name?.[0] ?? "";
        errors.value.description = errorMessages.description?.[0] ?? "";
        errors.value.studioId = errorMessages.studio_id?.[0] ?? "";
        errors.value.genreIds = errorMessages.genre_ids?.[0] ?? "";
      }
    })
    .finally(() => {
      isLoading.value = false;
    });
};

breadcrumbs.value = [
  { title: "ホーム", to: "/" },
  { title: "コース", to: "/course" },
  { title: course.value?.name ?? "", to: `/course/${courseId.value}` },
  { title: "編集", to: `/course/${courseId.value}/edit` },
];
</script>

<template>
  <v-row dense justify="center">
    <v-col cols="12" sm="10" md="9" lg="8" xl="7">
      <v-card>
        <v-card-text>
          <CourseForm :isLoading="isLoading" @save="onUpdate"></CourseForm>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
