<script setup lang="ts">
import { VForm } from "vuetify/components";

interface Props {
  organizationName: string;
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
      v-model="props.organizationName"
      label="団体・組織"
      placeholder=""
      type="email"
      variant="underlined"
      density="compact"
      hide-details="auto"
      disabled
      bg-color="white"
      class="mb-3"
    ></v-text-field>
    <v-text-field
      v-model="props.email"
      label="メールアドレス"
      placeholder="example@versionx.jp"
      type="email"
      variant="underlined"
      density="compact"
      hide-details="auto"
      disabled
      bg-color="white"
      class="mb-3"
    ></v-text-field>
    <v-row no-gutters>
      <v-col cols="6">
        <v-text-field
          v-model="lastName"
          label="苗字"
          placeholder="山田"
          variant="outlined"
          density="compact"
          hide-details="auto"
          bg-color="white"
          class="mb-3 mr-1"
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
          placeholder="太郎"
          variant="outlined"
          density="compact"
          hide-details="auto"
          bg-color="white"
          class="mb-3 ml-1"
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
          placeholder="ヤマダ"
          variant="outlined"
          density="compact"
          hide-details="auto"
          bg-color="white"
          class="mb-3 mr-1"
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
          placeholder="タロウ"
          variant="outlined"
          density="compact"
          hide-details="auto"
          bg-color="white"
          class="mb-3 ml-1"
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
      v-model="passwordConfirmation"
      label="パスワード（確認）"
      placeholder=""
      :type="isShowPasswordConfirmation ? 'text' : 'password'"
      variant="outlined"
      density="compact"
      hide-details="auto"
      class="mb-3"
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
      class="mt-4"
      block
      @click="onRegister"
      :loading="isLoading"
    >
      アカウント登録
    </v-btn>
  </v-form>
</template>
