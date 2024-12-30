<script setup lang="ts">
import { VForm } from "vuetify/components";
import { prefectures } from "@/composables/constants/prefectures";

interface Emits {
  (event: "prev"): void;
  (event: "next"): void;
}

const emits = defineEmits<Emits>();

const { email, organization } = useOrganizationRegisterInfo();
const { errors } = useErrors();
const { requiredRule, maxLengthRule, kanaRule, telRule } = validationRules();
const { showSnackbar } = useSnackbar();

const formElement = ref<VForm>();
const name = ref<string>(organization.value?.name ?? "");
const nameKana = ref<string>(organization.value?.nameKana ?? "");
const tel = ref<string>(organization.value?.tel ?? "");
const postalCode = ref<string>(organization.value?.postalCode ?? "");
const prefecture = ref<string>(organization.value?.prefecture ?? "");
const city = ref<string>(organization.value?.city ?? "");
const town = ref<string>(organization.value?.town ?? "");
const building = ref<string>(organization.value?.building ?? "");

const onPrev = () => {
  emits("prev");
};

const onNext = async () => {
  const isValid = (await formElement.value?.validate())?.valid;
  if (isValid) {
    organization.value = {
      name: name.value,
      nameKana: nameKana.value,
      email: email.value,
      tel: tel.value,
      postalCode: postalCode.value,
      prefecture: prefecture.value,
      city: city.value,
      town: town.value,
      building: building.value,
    };
    emits("next");
  } else {
    showSnackbar("入力内容を確認してください", "error");
  }
};

const onSearchAddress = async () => {
  await searchAddress(postalCode.value).then(
    (data: { prefecture: string; city: string; town: string } | null) => {
      if (data) {
        prefecture.value = data.prefecture;
        city.value = data.city;
        town.value = data.town;
      } else {
        showSnackbar("郵便番号が見つかりませんでした", "warning");
      }
    }
  );
};
</script>

<template>
  <v-form ref="formElement">
    <p class="mb-3">団体・法人情報を入力してください</p>
    <v-text-field
      v-model="name"
      label="組織名"
      placeholder="山田"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3 mr-1"
      :error="!!errors.lastName"
      :error-messages="errors.lastName"
      :rules="[
        (v) => requiredRule(v, '組織名'),
        (v) => maxLengthRule(v, 100, '組織名'),
      ]"
    >
    </v-text-field>

    <v-text-field
      v-model="nameKana"
      label="ソシキメイ"
      placeholder="山田"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3 mr-1"
      :error="!!errors.lastName"
      :error-messages="errors.lastName"
      :rules="[
        (v) => requiredRule(v, 'ソシキメイ'),
        (v) => kanaRule(v, 'ソシキメイ'),
        (v) => maxLengthRule(v, 100, 'ソシキメイ'),
      ]"
    >
    </v-text-field>
    <v-text-field
      v-model="email"
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
    <v-text-field
      v-model="tel"
      label="電話番号"
      placeholder="09010101010"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class=""
      :error="!!errors.tel"
      :error-messages="errors.tel"
      :rules="[
        (v) => requiredRule(v, '電話番号'),
        (v) => telRule(v, '電話番号'),
      ]"
    ></v-text-field>
    <div class="flex items-end justify-start">
      <v-label class="mr-3 mb-7">郵便番号</v-label>
      <v-otp-input
        v-model="postalCode"
        variant="underlined"
        class="mb-2"
        height="50"
        max-width="200"
        length="7"
        @finish="onSearchAddress"
      ></v-otp-input>
    </div>
    <v-autocomplete
      v-model="prefecture"
      label="都道府県"
      :items="prefectures"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3"
      :error="!!errors.prefecture"
      :error-messages="errors.prefecture"
      :rules="[(v) => requiredRule(v, '都道府県')]"
    ></v-autocomplete>
    <v-text-field
      v-model="city"
      label="市区町村"
      placeholder="浜松市中央区"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3"
      :error="!!errors.city"
      :error-messages="errors.city"
      :rules="[
        (v) => requiredRule(v, '市区町村'),
        (v) => maxLengthRule(v, 250, '市区町村'),
      ]"
    ></v-text-field>
    <v-text-field
      v-model="town"
      label="町域番地"
      placeholder="板屋町102-15"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3"
      :error="!!errors.town"
      :error-messages="errors.town"
      :rules="[
        (v) => requiredRule(v, '町域番地'),
        (v) => maxLengthRule(v, 250, '町域番地'),
      ]"
    ></v-text-field>
    <v-text-field
      v-model="building"
      label="建物名、部屋番号等"
      placeholder="河合ビル"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3"
      :error="!!errors.building"
      :error-messages="errors.building"
      :rules="[(v) => maxLengthRule(v, 250, '建物名、部屋番号等')]"
    ></v-text-field>

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
