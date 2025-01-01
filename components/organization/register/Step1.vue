<script setup lang="ts">
import { VForm } from "vuetify/components";
import { prefectures } from "@/composables/constants/prefectures";
import type { Gender } from "@/types/common/Gender";

interface Emits {
  (event: "next"): void;
}

const emits = defineEmits<Emits>();

const { email, worker } = useOrganizationRegisterInfo();
const { errors } = useErrors();
const { requiredRule, maxLengthRule, kanaRule, telRule } = validationRules();
const { showSnackbar } = useSnackbar();

const formElement = ref<VForm>();
const lastName = ref<string>(worker.value?.lastName ?? "");
const firstName = ref<string>(worker.value?.firstName ?? "");
const lastNameKana = ref<string>(worker.value?.lastNameKana ?? "");
const firstNameKana = ref<string>(worker.value?.firstNameKana ?? "");
const gender = ref<Gender | null>(worker.value?.gender ?? null);
const dateOfBirth = ref<string>(worker.value?.dateOfBirth ?? "");
const tel = ref<string>(worker.value?.tel ?? "");
const postalCode = ref<string>(worker.value?.postalCode ?? "");
const prefecture = ref<string>(worker.value?.prefecture ?? "");
const city = ref<string>(worker.value?.city ?? "");
const town = ref<string>(worker.value?.town ?? "");
const building = ref<string>(worker.value?.building ?? "");

const onNext = async () => {
  const isValid = (await formElement.value?.validate())?.valid;
  if (isValid) {
    worker.value = {
      lastName: lastName.value,
      firstName: firstName.value,
      lastNameKana: lastNameKana.value,
      firstNameKana: firstNameKana.value,
      gender: gender.value,
      dateOfBirth: dateOfBirth.value,
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
    <p class="mb-3">代表者情報を入力してください</p>
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
    <v-label class="mt-2">性別</v-label>
    <v-radio-group
      v-model="gender"
      inline
      density="compact"
      hide-details="auto"
      class="mb-3"
      :error="!!errors.gender"
      :error-messages="errors.gender"
      :rules="[(v) => requiredRule(v, '性別')]"
    >
      <v-radio
        v-for="item in [
          { key: 'male', label: '男性' },
          { key: 'female', label: '女性' },
          { key: 'other', label: 'その他' },
        ]"
        :key="item.key"
        :label="item.label"
        :value="item.key"
        class="mr-2"
      ></v-radio>
    </v-radio-group>
    <common-select-date
      :date="dateOfBirth"
      :clearable="true"
      label="生年月日"
      placeholder="2000-01-01"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class-name="mb-3"
      @selectedDate="(date) => (dateOfBirth = date)"
    ></common-select-date>
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

    <div class="flex items-center justify-end">
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
