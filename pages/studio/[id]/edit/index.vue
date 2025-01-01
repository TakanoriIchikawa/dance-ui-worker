<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import type { ErrorResponse } from "@/types/api/ErrorResponse";

const route = useRoute();
const { studio, find, update } = useStudio();
const { errors } = useErrors();
const { showSnackbar } = useSnackbar();
const { breadcrumbs } = useBreadcrumbs();
const isLoading = ref<boolean>(false);

const studioId = computed((): string => {
  return String(route.params.id);
});

await useAsyncData("findStudioData", async () => {
  await find(studioId.value);
  return { studio: studio.value };
});

onBeforeMount(() => {
  errors.value = {};
});

if (!studio.value) {
  throw createError({ statusCode: 404 });
}

const onUpdate = async (params: any) => {
  isLoading.value = true;
  await update(studioId.value, params)
    .then(() => {
      showSnackbar("スタジオの更新に成功しました", "primary");
      breadcrumbs.value = [
        { title: "ホーム", to: "/" },
        { title: "スタジオ", to: "/studio" },
        { title: studio.value?.name ?? "", to: `/studio/${studioId.value}` },
        { title: "編集", to: `/studio/${studioId.value}/edit` },
      ];
    })
    .catch((errorResponse: ErrorResponse) => {
      showSnackbar(errorResponse.data.message, "error");
      if (errorResponse.status === 422) {
        const errorMessages = errorResponse.data.errors;
        errors.value.name = errorMessages.name?.[0] ?? "";
        errors.value.description = errorMessages.description?.[0] ?? "";
        errors.value.tel = errorMessages.tel?.[0] ?? "";
        errors.value.email = errorMessages.email?.[0] ?? "";
        errors.value.postalCode = errorMessages.postalCode?.[0] ?? "";
        errors.value.prefecture = errorMessages.prefecture?.[0] ?? "";
        errors.value.city = errorMessages.city?.[0] ?? "";
        errors.value.town = errorMessages.town?.[0] ?? "";
        errors.value.building = errorMessages.building?.[0] ?? "";
        errors.value.genreIds = errorMessages.genre_ids?.[0] ?? "";
      }
    })
    .finally(() => {
      isLoading.value = false;
    });
};

breadcrumbs.value = [
  { title: "ホーム", to: "/" },
  { title: "スタジオ", to: "/studio" },
  { title: studio.value?.name ?? "", to: `/studio/${studioId.value}` },
  { title: "編集", to: `/studio/${studioId.value}/edit` },
];
</script>

<template>
  <v-row dense justify="center">
    <v-col cols="12" sm="10" md="9" lg="8" xl="7">
      <v-card>
        <v-card-text>
          <StudioForm :isLoading="isLoading" @save="onUpdate"></StudioForm>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.v-otp-input :deep(input) {
  font-size: 1rem;
}
</style>
