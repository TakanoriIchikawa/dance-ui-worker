<script setup lang="ts">
import { VForm } from "vuetify/components";

interface Props {
  isLoading: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

interface Emits {
  (event: "signin", params: any): void;
}

const emits = defineEmits<Emits>();

const { errors } = useErrors();
const { requiredRule, emailRule } = validationRules();
const formElement = ref<VForm>();
const email = ref<string>("");
const password = ref<string>("");
const isShowPassword = ref<boolean>(false);

const onSignin = async () => {
  const isValid = (await formElement.value?.validate())?.valid;
  if (isValid) {
    const params = {
      email: email.value,
      password: password.value,
    };
    emits("signin", params);
  }
};

</script>

<template>
  <v-form ref="formElement">
    <v-text-field
      v-model="email"
      label="メールアドレス"
      type="email"
      variant="underlined"
      placeholder="example@versionx.jp"
      hide-details="auto"
      bg-color="white"
      class="mb-2"
      :error="!!errors.email"
      :error-messages="errors.email"
      :rules="[
        (v) => requiredRule(v, 'メールアドレス'),
        (v) => emailRule(v, 'メールアドレス'),
      ]"
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="パスワード"
      :type="isShowPassword ? 'text' : 'password'"
      variant="underlined"
      placeholder=""
      hide-details="auto"
      class="mb-2"
      :error="!!errors.password"
      :error-messages="errors.password"
      :rules="[(v) => requiredRule(v, 'パスワード')]"
    >
      <template v-slot:append-inner>
        <v-icon v-if="isShowPassword" @click="isShowPassword = false" class="mr-1">mdi-eye</v-icon>
        <v-icon v-else @click="isShowPassword = true" class="mr-1">mdi-eye-off</v-icon>
      </template>
    </v-text-field>
    <v-btn
      color="primary"
      size="large"
      variant="elevated"
      class="mt-5"
      block
      @click="onSignin"
      :loading="isLoading"
    >
      ログイン
    </v-btn>
  </v-form>
</template>
