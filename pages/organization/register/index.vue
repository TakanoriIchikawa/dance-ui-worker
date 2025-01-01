<script setup lang="ts">
definePageMeta({ layout: "guest" });

import type { ErrorResponse } from "@/types/api/ErrorResponse";

const route = useRoute();
const router = useRouter();
const { auth, login, logout } = useAuth();
const {
  organization: createdOrganization,
  register,
  verifyEmail,
} = useOrganization();
const {
  email,
  worker,
  organization,
  plan,
  cardToken,
  password,
  passwordConfirmation,
  isInputWorker,
  isInputOrganization,
  isInputPlan,
  isInputPassword,
  clear,
} = useOrganizationRegisterInfo();
const { errors } = useErrors();
const { showSnackbar } = useSnackbar();
const isExpiration = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const { data } = await useAsyncData("verifyEmailData", async () => {
  return await verifyEmail(String(route.query.token))
    .then((data: { email: string; isExpiration: boolean }) => {
      return data;
    })
    .catch((error) => {
      //
    });
});

if (data.value) {
  if (email.value !== data.value.email) {
    clear();
  }
  email.value = data.value.email;
  isExpiration.value = data.value.isExpiration;
}

if (!isExpiration.value) {
  throw createError({ statusCode: 401 });
}

onBeforeMount(async () => {
  errors.value = {};
  if (auth.value) {
    await logout();
  }
});

const onRegister = async () => {
  isLoading.value = true;
  if (isInputWorker && isInputOrganization && isInputPlan && isInputPassword) {
    const params = {
      email: email.value,
      card_token_id: cardToken.value?.id,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
      organization: {
        name: organization.value?.name,
        name_kana: organization.value?.nameKana,
        plan: plan.value,
        last_name: worker.value?.lastName,
        first_name: worker.value?.firstName,
        last_name_kana: worker.value?.lastNameKana,
        first_name_kana: worker.value?.firstNameKana,
        email: email.value,
        tel: organization.value?.tel,
        postal_code: organization.value?.postalCode,
        prefecture: organization.value?.prefecture,
        city: organization.value?.city,
        town: organization.value?.town,
        building: organization.value?.building,
      },
      worker: {
        last_name: worker.value?.lastName,
        first_name: worker.value?.firstName,
        last_name_kana: worker.value?.lastNameKana,
        first_name_kana: worker.value?.firstNameKana,
        gender: worker.value?.gender,
        date_of_birth: worker.value?.dateOfBirth,
        email: email.value,
        tel: worker.value?.tel,
        postal_code: worker.value?.postalCode,
        prefecture: worker.value?.prefecture,
        city: worker.value?.city,
        town: worker.value?.town,
        building: worker.value?.building,
      },
    };

    await register(params)
      .then(async () => {
        showSnackbar("アカウント登録に成功しました", "primary");
        if (createdOrganization.value) {
          await login({
            email: email.value,
            password: password.value,
            organization_id: createdOrganization.value.id,
          }).then(() => {
            router.push("/");
            clear();
          });
        }
      })
      .catch((errorResponse: ErrorResponse) => {
        showSnackbar(errorResponse.data.message, "error");
        if (errorResponse.status === 422) {
          const errorMessages = errorResponse.data.errors;
          // errors.value.lastName = errorMessages.last_name?.[0] ?? "";
          // errors.value.firstName = errorMessages.first_name?.[0] ?? "";
          // errors.value.lastNameKana = errorMessages.last_name_kana?.[0] ?? "";
          // errors.value.firstNameKana = errorMessages.first_name_kana?.[0] ?? "";
          // errors.value.email = errorMessages.email?.[0] ?? "";
          // errors.value.password = errorMessages.password?.[0] ?? "";
        }
      })
      .finally(() => {
        isLoading.value = false;
      });
  }
};
</script>

<template>
  <v-row dense justify="center">
    <v-col cols="12" sm="10" md="9" lg="8" xl="7">
      <v-stepper>
        <template v-slot:default="{ prev, next }">
          <v-stepper-header>
            <v-stepper-item value="1" :complete="isInputWorker" editable>
              代表者情報
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item value="2" :complete="isInputOrganization" editable>
              団体・法人情報
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item value="3" :complete="isInputPlan" editable>
              契約プラン
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item value="4" :complete="isInputPassword" editable>
              ログインパスワード
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item value="5" editable> 申込内容確認 </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item value="6"> 完了 </v-stepper-item>
          </v-stepper-header>
          <v-stepper-window>
            <v-stepper-window-item value="1">
              <OrganizationRegisterStep1
                @next="next"
              ></OrganizationRegisterStep1>
            </v-stepper-window-item>
            <v-stepper-window-item value="2">
              <OrganizationRegisterStep2
                @prev="prev"
                @next="next"
              ></OrganizationRegisterStep2>
            </v-stepper-window-item>
            <v-stepper-window-item value="3">
              <OrganizationRegisterStep3
                @prev="prev"
                @next="next"
              ></OrganizationRegisterStep3>
            </v-stepper-window-item>
            <v-stepper-window-item value="4">
              <OrganizationRegisterStep4
                @prev="prev"
                @next="next"
              ></OrganizationRegisterStep4>
            </v-stepper-window-item>
            <v-stepper-window-item value="5">
              <OrganizationRegisterStep5
                @prev="prev"
                @next="onRegister"
                :isLoading="isLoading"
              ></OrganizationRegisterStep5>
            </v-stepper-window-item>
          </v-stepper-window>
        </template>
      </v-stepper>
    </v-col>
  </v-row>
</template>
