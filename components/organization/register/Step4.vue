<script setup lang="ts">
import { VForm } from "vuetify/components";

interface Emits {
  (event: "prev"): void;
  (event: "next"): void;
}

const emits = defineEmits<Emits>();

const { password, passwordConfirmation } = useOrganizationRegisterInfo();
const { errors } = useErrors();
const { requiredRule, passwordRule, sameRule } = validationRules();
const { showSnackbar } = useSnackbar();

const formElement = ref<VForm>();
const inputPassword = ref<string>(password.value);
const inputPasswordConfirmation = ref<string>(passwordConfirmation.value);
const isShowPassword = ref<boolean>(false);
const isShowPasswordConfirmation = ref<boolean>(false);

const onPrev = () => {
  emits("prev");
};

const onNext = async () => {
  const isValid = (await formElement.value?.validate())?.valid;
  if (isValid) {
    password.value = inputPassword.value;
    passwordConfirmation.value = inputPasswordConfirmation.value;
    emits("next");
  } else {
    showSnackbar("入力内容を確認してください", "error");
  }
};
</script>

<template>
  <v-form ref="formElement">
    <p class="mb-3">ログインパスワードを入力してください</p>
    <v-text-field
      v-model="inputPassword"
      label="パスワード"
      placeholder=""
      :type="isShowPassword ? 'text' : 'password'"
      variant="outlined"
      density="compact"
      hide-details="auto"
      class="mb-3"
      :error="!!errors.password"
      :error-messages="errors.password"
      :rules="[
        (v) => requiredRule(v, 'パスワード'),
        (v) => passwordRule(v, 'パスワード'),
      ]"
    >
      <template v-slot:append-inner>
        <v-icon
          v-if="isShowPassword"
          @click="isShowPassword = false"
          class="mr-1"
          >mdi-eye</v-icon
        >
        <v-icon v-else @click="isShowPassword = true" class="mr-1"
          >mdi-eye-off</v-icon
        >
      </template>
    </v-text-field>
    <v-text-field
      v-model="inputPasswordConfirmation"
      label="パスワード（確認）"
      placeholder=""
      :type="isShowPasswordConfirmation ? 'text' : 'password'"
      variant="outlined"
      density="compact"
      hide-details="auto"
      class="mb-3"
      :rules="[
        (v) => requiredRule(v, 'パスワード（確認）'),
        (v) => sameRule(v, inputPassword, 'パスワード（確認）', 'パスワード'),
      ]"
    >
      <template v-slot:append-inner>
        <v-icon
          v-if="isShowPasswordConfirmation"
          @click="isShowPasswordConfirmation = false"
          class="mr-1"
          >mdi-eye</v-icon
        >
        <v-icon v-else @click="isShowPasswordConfirmation = true" class="mr-1"
          >mdi-eye-off</v-icon
        >
      </template>
    </v-text-field>

    <v-divider class="my-3"></v-divider>

    <div class="flex items-center justify-between">
      <v-btn color="" size="large" variant="tonal" class="" @click="onPrev">
        前へ
      </v-btn>
      <v-btn
        color="primary"
        size="large"
        variant="elevated"
        class=""
        @click="onNext"
      >
        次へ
      </v-btn>
    </div>
  </v-form>
</template>
