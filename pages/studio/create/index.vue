<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import type { ErrorResponse } from "@/type/api/ErrorResponse";

const router = useRouter();
const { studio, create } = useStudio();
const { errors } = useErrors();
const { showSnackbar } = useSnackbar();
const { breadcrumbs } = useBreadcrumbs();
const isLoading = ref<boolean>(false);

onBeforeMount(() => {
  studio.value = null;
  errors.value = {};
});

const onCreate = async (params: any) => {
  isLoading.value = true;
  await create(params)
    .then(() => {
      showSnackbar("スタジオの登録に成功しました", "success");
      router.push("/studio");
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
  { title: "新規登録", to: "/studio/create" },
];
</script>

<template>
  <v-row dense justify="center">
    <v-col cols="12" sm="10" md="8" lg="7" xl="6">
      <v-card>
        <v-card-text>
          <StudioForm :isLoading="isLoading" @save="onCreate"></StudioForm>
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
