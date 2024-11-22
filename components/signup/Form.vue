<script setup lang="ts">
import { VForm } from "vuetify/components";

interface Props {
  organizationId: string;
  email: string;
  isLoading: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

interface Emits {
  (event: "save", params: any): void;
}

const emits = defineEmits<Emits>();

const { errors } = useErrors();
const { requiredRule, maxLengthRule, kanaRule, passwordRule, sameRule } =
  validationRules();

const formElement = ref<VForm>();
const lastName = ref<string>("");
const firstName = ref<string>("");
const lastNameKana = ref<string>("");
const firstNameKana = ref<string>("");
const password = ref<string>("");
const passwordConfirmation = ref<string>("");
const isShowPassword = ref<boolean>(false);
const isShowPasswordConfirmation = ref<boolean>(false);

const onRegister = async () => {
  const isValid = (await formElement.value?.validate())?.valid;
  if (isValid) {
    const params = {
      organization_id: props.organizationId,
      last_name: lastName.value,
      first_name: firstName.value,
      last_name_kana: lastNameKana.value,
      first_name_kana: firstNameKana.value,
      email: props.email,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    };
    emits("save", params);
  }
};
</script>

<template>
  <v-form ref="formElement">
    <v-text-field
      v-model="props.email"
      label="メールアドレス"
      type="email"
      variant="underlined"
      placeholder="example@versionx.jp"
      hide-details="auto"
      disabled
      bg-color="white"
      class="mb-1"
    ></v-text-field>

    <v-row no-gutters>
      <v-col cols="6">
        <v-text-field
          v-model="lastName"
          label="苗字"
          type="text"
          variant="underlined"
          placeholder="山田"
          hide-details="auto"
          bg-color="white"
          class="mb-2 mr-1"
          :error="!!errors.lastName"
          :error-messages="errors.lastName"
          :rules="[
            (v) => requiredRule(v, '苗字'),
            (v) => maxLengthRule(v, 100, '苗字'),
          ]"
        >
        </v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="firstName"
          label="名前"
          type="text"
          variant="underlined"
          placeholder="太郎"
          hide-details="auto"
          bg-color="white"
          class="mb-2 ml-1"
          :error="!!errors.firstName"
          :error-messages="errors.firstName"
          :rules="[
            (v) => requiredRule(v, '名前'),
            (v) => maxLengthRule(v, 100, '名前'),
          ]"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="6">
        <v-text-field
          v-model="lastNameKana"
          label="ミョウジ"
          type="text"
          variant="underlined"
          placeholder="ヤマダ"
          hide-details="auto"
          bg-color="white"
          class="mb-2 mr-1"
          :error="!!errors.lastNameKana"
          :error-messages="errors.lastNameKana"
          :rules="[
            (v) => requiredRule(v, 'ミョウジ'),
            (v) => kanaRule(v, 'ミョウジ'),
            (v) => maxLengthRule(v, 100, 'ミョウジ'),
          ]"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="firstNameKana"
          label="ナマエ"
          type="text"
          variant="underlined"
          placeholder="タロウ"
          hide-details="auto"
          bg-color="white"
          class="mb-2 ml-1"
          :error="!!errors.firstNameKana"
          :error-messages="errors.firstNameKana"
          :rules="[
            (v) => requiredRule(v, 'ナマエ'),
            (v) => kanaRule(v, 'ナマエ'),
            (v) => maxLengthRule(v, 100, 'ナマエ'),
          ]"
        ></v-text-field>
      </v-col>
    </v-row>

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
      v-model="passwordConfirmation"
      label="パスワード（確認）"
      :type="isShowPasswordConfirmation ? 'text' : 'password'"
      variant="underlined"
      placeholder=""
      hide-details="auto"
      class="mb-2"
      :rules="[
        (v) => requiredRule(v, 'パスワード（確認）'),
        (v) => sameRule(v, password, 'パスワード（確認）', 'パスワード'),
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

    <v-btn
      color="primary"
      size="large"
      variant="elevated"
      class="mt-5"
      block
      @click="onRegister"
      :loading="isLoading"
    >
      アカウント登録
    </v-btn>
  </v-form>
</template>
