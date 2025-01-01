<script setup lang="ts">
definePageMeta({ layout: "guest" });

import type { ErrorResponse } from "@/types/api/ErrorResponse";

const route = useRoute();
const router = useRouter();
const { auth, logout, register, verifyEmail } = useAuth();
const { organization, find } = useOrganization();
const { errors } = useErrors();
const { showSnackbar } = useSnackbar();
const email = ref<string>("");
const isExpiration = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const { data } = await useAsyncData("verifyEmailData", async () => {
  return await verifyEmail(String(route.query.token))
    .then(
      (data: {
        email: string;
        organizationId: string;
        isExpiration: boolean;
      }) => {
        return data;
      }
    )
    .catch((error) => {
      //
    });
});

await useAsyncData("findOrganizationData", async () => {
  if (data.value?.organizationId) {
    await find(data.value.organizationId);
    return { organization: organization.value };
  }
});

if (data.value) {
  email.value = data.value.email;
  isExpiration.value = data.value.isExpiration;
}

if (!isExpiration.value) {
  throw createError({ statusCode: 401 });
}

if (!organization.value) {
  throw createError({ statusCode: 404 });
}

onBeforeMount(async () => {
  errors.value = {};
  if (auth.value) {
    await logout();
  }
});

const onRegister = async (params: any) => {
  isLoading.value = true;
  await register(params)
    .then(() => {
      showSnackbar(
        "アカウント登録に成功しました、プロフィールを設定してください",
        "success"
      );
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
    <v-col cols="12" sm="8" md="7" lg="6" xl="5">
      <v-card class="md:mt-5">
        <v-card-title>
          <v-label>
            <h1 class="text-lg">サインアップ</h1>
          </v-label>
        </v-card-title>
        <v-card-text>
          <SignupForm
            v-if="organization"
            :organizationName="organization?.name"
            :organizationId="organization.id"
            :email="email"
            :isLoading="isLoading"
            @save="onRegister"
          ></SignupForm>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
