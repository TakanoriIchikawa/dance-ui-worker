<script setup lang="ts">
definePageMeta({ layout: "guest", middleware: ["guest"] });

import type { ErrorResponse } from "@/type/api/ErrorResponse";

const { register, verifyEmail } = useAuth();
const { errors } = useErrors();
const { showSnackbar } = useSnackbar();
const route = useRoute();
const router = useRouter();
const organizationId = ref<string>("");
const email = ref<string>("");
const isExpiration = ref<boolean>(false);
const password = ref<string>("");
const passwordConfirmation = ref<string>("");
const isLoading = ref<boolean>(false);

const { data } = await useAsyncData("fetchWorkerData", async () => {
  return await verifyEmail(String(route.query.token)).then((data: { email: string, organizationId: string, isExpiration: boolean }) => {
    return data;
  });
});

if (data.value) {
  organizationId.value = data.value.organizationId;
  email.value = data.value.email;
  isExpiration.value = data.value.isExpiration;
}

onBeforeMount(() => {
  errors.value = {};
});

if (!isExpiration.value) {
  throw createError({ statusCode: 401 });
}

const onRegister = async (params: any) => {
  isLoading.value = true;
  await register(params)
    .then(() => {
      showSnackbar("アカウント登録に成功しました、プロフィールを設定してください", "success");
      router.push("/account/edit");
    })
    .catch((errorResponse: ErrorResponse) => {
      showSnackbar(errorResponse.data.message, "error");
      if (errorResponse.status === 422) {
        const errorMessages = errorResponse.data.errors;
        errors.value.lastName = errorMessages.last_name?.[0] ?? "";
        errors.value.firstName = errorMessages.first_name?.[0] ?? "";
        errors.value.lastNameKana = errorMessages.last_name_kana?.[0] ?? "";
        errors.value.firstNameKana = errorMessages.first_name_kana?.[0] ?? "";
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
    <v-col cols="12" sm="10" md="8" lg="6" xl="4">
      <v-card class="md:mt-5">
        <v-card-title>
          <v-label>
            <h1 class="text-lg">サインアップ</h1>
          </v-label>
        </v-card-title>
        <v-card-text>
          <SignupForm
            :organizationId="organizationId"
            :email="email"
            :isLoading="isLoading"
            @save="onRegister"
          ></SignupForm>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
