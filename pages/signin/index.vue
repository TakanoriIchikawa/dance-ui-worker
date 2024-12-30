<script setup lang="ts">
definePageMeta({ layout: "guest", middleware: ["guest"] });

import type { ErrorResponse } from "@/type/api/ErrorResponse";

const route = useRoute();
const router = useRouter();
const { login } = useAuth();
const { errors } = useErrors();
const { showSnackbar } = useSnackbar();
const isLoading = ref<boolean>(false);

const onLogin = async (params: any) => {
  isLoading.value = true;
  await login(params)
    .then(() => {
      showSnackbar("ログインに成功しました", "success");
      router.push(
        route.query.returnPath ? String(route.query.returnPath) : "/"
      );
    })
    .catch((errorResponse: ErrorResponse) => {
      showSnackbar(errorResponse.data.message, "error");
      if (errorResponse.status === 422) {
        const errorMessages = errorResponse.data.errors;
        errors.value.email = errorMessages.email?.[0] ?? "";
        errors.value.password = errorMessages.password?.[0] ?? "";
      }
    })
    .finally(() => {
      isLoading.value = false;
    });
};

</script>

<template>
  <v-row dense justify="center">
    <v-col cols="12">
      <v-card max-width="375" class="mx-auto mt-5">
        <v-card-title>
          <v-label>
            <h1 class="text-lg">サインイン</h1>
          </v-label>
        </v-card-title>
        <v-card-text>
          <SigninForm :isLoading="isLoading" @signin="onLogin"></SigninForm>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
