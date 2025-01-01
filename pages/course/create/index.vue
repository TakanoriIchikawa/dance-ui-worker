<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import type { ErrorResponse } from "@/types/api/ErrorResponse";

const router = useRouter();
const { course, create } = useCourse();
const { errors } = useErrors();
const { showSnackbar } = useSnackbar();
const { breadcrumbs } = useBreadcrumbs();
const isLoading = ref<boolean>(false);

onBeforeMount(() => {
  course.value = null;
  errors.value = {};
});

const onCreate = async (params: any) => {
  isLoading.value = true;
  await create(params)
    .then(() => {
      showSnackbar("コースの登録に成功しました", "primary");
      router.push("/course");
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
  { title: "新規登録", to: "/course/create" },
];
</script>

<template>
  <v-row dense justify="center">
    <v-col cols="12" sm="10" md="9" lg="8" xl="7">
      <v-card>
        <v-card-text>
          <CourseForm :isLoading="isLoading" @save="onCreate"></CourseForm>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
