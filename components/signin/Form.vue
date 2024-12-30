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

const { organizations, all } = useOrganization();
const { errors } = useErrors();
const { requiredRule, emailRule } = validationRules();
const { showSnackbar } = useSnackbar();
const formElement = ref<VForm>();
const email = ref<string>("");
const organizationId = ref<string>("");
const password = ref<string>("");
const isShowPassword = ref<boolean>(false);

const isEmailValid = computed(() => {
  const emailRules = [
    (v: string) => requiredRule(v, "メールアドレス") === true,
    (v: string) => emailRule(v, "メールアドレス") === true,
  ];
  return emailRules.every((rule) => rule(email.value));
});

watch(organizations, (newValue) => {
  if (0 < organizations.value.length) {
    organizationId.value = organizations.value[0].id;
  }
});

const onAll = async () => {
  await all({ worker_email: email.value }).then(() => {
    if (1 > organizations.value.length) {
      showSnackbar(
        "所属する団体・組織が見つかりません、メールアドレスを確認してください",
        "warning"
      );
    }
  });
};

const onSignin = async () => {
  const isValid = (await formElement.value?.validate())?.valid;
  if (isValid) {
    const params = {
      email: email.value,
      password: password.value,
      organization_id: organizationId.value,
    };
    emits("signin", params);
  }
};
</script>

<template>
  <v-form ref="formElement">
    <v-label>
      <p class="text-sm pb-2">メールアドレスを入力してください</p>
    </v-label>
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
    >
      <template v-slot:append>
        <v-btn
          icon
          density="comfortable"
          color="primary"
          :disabled="!isEmailValid"
          @click="onAll"
        >
          <v-icon size="small">mdi-email-search-outline</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <template v-if="0 < organizations.length">
      <v-autocomplete
        v-model="organizationId"
        label="団体・組織"
        :items="organizations"
        item-title="name"
        item-value="id"
        variant="outlined"
        density="compact"
        hide-details="auto"
        bg-color="white"
        class="mb-3"
        :error="!!errors.organizationId"
        :error-messages="errors.organizationId"
        :rules="[(v) => requiredRule(v, '団体・組織')]"
      ></v-autocomplete>
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
        :rules="[(v) => requiredRule(v, 'パスワード')]"
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
      <v-btn
        color="primary"
        size="large"
        variant="elevated"
        class=""
        block
        @click="onSignin"
        :loading="isLoading"
      >
        ログイン
      </v-btn>
    </template>
  </v-form>
</template>
