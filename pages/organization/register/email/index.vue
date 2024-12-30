<script setup lang="ts">
definePageMeta({ layout: "guest", middleware: ["guest"] });

import { VForm } from "vuetify/components";
import type { ErrorResponse } from "@/type/api/ErrorResponse";

const { temporaryEmail } = useOrganization();
const { errors } = useErrors();
const { requiredRule, emailRule } = validationRules();
const { showSnackbar } = useSnackbar();

const formElement = ref<VForm>();
const email = ref<string>("");
const isLoading = ref<boolean>(false);

onBeforeMount(() => {
  email.value = "";
  errors.value = {};
});

const onTemporaryEmail = async () => {
  errors.value.email = null
  const isValid = (await formElement.value?.validate())?.valid;
  if (isValid) {
    isLoading.value = true;
    await temporaryEmail(email.value)
      .then(() => {
        showSnackbar(`${email.value}にメールを送信しました`, "success");
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
</script>

<template>
  <v-row dense justify="center">
    <v-col cols="12">
      <v-card max-width="375" class="mx-auto mt-5">
        <v-card-text>
          <p class="mb-3">
            メールアドレスを入力して、「メール送信」ボタンを押してください。
          </p>
          <v-form ref="formElement">
            <v-text-field
              v-model="email"
              label="メールアドレス"
              placeholder="example@versionx.jp"
              type="email"
              variant="outlined"
              density="compact"
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
              @click="onTemporaryEmail"
              :loading="isLoading"
            >
              メール送信
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
