<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import type { ErrorResponse } from "@/type/api/ErrorResponse";

const { auth, update } = useAuth();
const { errors } = useErrors();
const { showSnackbar } = useSnackbar();
const { breadcrumbs } = useBreadcrumbs();
const isLoading = ref<boolean>(false);

onBeforeMount(() => {
  errors.value = {};
});

if (!auth.value) {
  throw createError({ statusCode: 401 });
}

const onUpdate = async (params: any) => {
  isLoading.value = true;
  await update(params)
    .then(() => {
      showSnackbar("アカウントの更新に成功しました", "success");
    })
    .catch((errorResponse: ErrorResponse) => {
      showSnackbar(errorResponse.data.message, "error");
      if (errorResponse.status === 422) {
        const errorMessages = errorResponse.data.errors;
        errors.value.name = errorMessages.name?.[0] ?? "";
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
  { title: "アカウント", to: "/account" },
  { title: "編集", to: "/account/edit" },
];
</script>

<template>
  <v-row dense justify="center">
    <v-col cols="12" sm="10" md="8" lg="7" xl="6">
      <v-card>
        <v-card-text>
          <AccountForm :isLoading="isLoading" @save="onUpdate"></AccountForm>
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
