<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import { VForm } from "vuetify/components";
import type { ErrorResponse } from "@/type/api/ErrorResponse";

const router = useRouter();
const { worker, invitation } = useWorker();
const { errors } = useErrors();
const { requiredRule, emailRule } = validationRules();
const { showSnackbar } = useSnackbar();
const { breadcrumbs } = useBreadcrumbs();

const formElement = ref<VForm>();
const email = ref<string>("");
const isLoading = ref<boolean>(false);

onBeforeMount(() => {
  worker.value = null;
  errors.value = {};
});

const onInvitation = async () => {
  errors.value.email = null
  const isValid = (await formElement.value?.validate())?.valid;
  if (isValid) {
    isLoading.value = true;
    await invitation(email.value)
      .then(() => {
        showSnackbar(`${email.value}に招待メールを送信しました`, "success");
      })
      .catch((errorResponse: ErrorResponse) => {
        showSnackbar(errorResponse.data.message, "error");
        if (errorResponse.status === 422) {
          const errorMessages = errorResponse.data.errors;
          errors.value.email = errorMessages.email?.[0] ?? "";
        }
      })
      .finally(() => {
        isLoading.value = false;
      });
    }
};

breadcrumbs.value = [
  { title: "ホーム", to: "/" },
  { title: "講師", to: "/worker" },
  { title: "新規登録", to: "/worker/create" },
];
</script>

<template>
  <v-row dense justify="center">
    <v-col cols="12" sm="10" md="10" lg="8" xl="6">
      <v-card>
        <v-card-text>
          <p class="mb-2">
            メールアドレスを入力して、「招待メール送信」ボタンを押してください。
          </p>
          <v-form ref="formElement">
            <v-text-field
              v-model="email"
              label="メールアドレス"
              type="email"
              density="compact"
              variant="outlined"
              placeholder="example@versionx.jp"
              hide-details="auto"
              bg-color="white"
              class="mb-3"
              :error="!!errors.email"
              :error-messages="errors.email"
              :rules="[
                (v) => requiredRule(v, 'メールアドレス'),
                (v) => emailRule(v, 'メールアドレス'),
              ]"
            ></v-text-field>
            <v-btn
              color="primary"
              size="large"
              variant="elevated"
              class="mb-2"
              block
              @click="onInvitation"
              :loading="isLoading"
            >
              招待メール送信
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
