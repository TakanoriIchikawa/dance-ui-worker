<script setup lang="ts">
import { VForm } from "vuetify/components";
import { VDateInput } from "vuetify/labs/VDateInput";
import { prefectures } from "@/composables/constants/prefectures";
import type { Genre } from "@/interface/entities/Genre";

interface Props {
  isLoading: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

interface Emits {
  (event: "save", params: any): void;
}

const emits = defineEmits<Emits>();

const { auth } = useAuth();
const { genres, all } = useGenre();
const { errors } = useErrors();
const {
  requiredRule,
  maxLengthRule,
  minNumberRule,
  maxNumberRule,
  telRule,
  emailRule,
} = validationRules();
const { showSnackbar } = useSnackbar();

await useAsyncData("allGenreData", async () => {
  await all({});
  return { genres: genres.value };
});

const formElement = ref<VForm>();
const file = ref<File | null>(null);
const previewUrl = ref<string | null>(auth.value?.image ?? null);
const isRemoveImage = ref<boolean>(false);
const nickname = ref<string>(auth.value?.nickname ?? "");
const lastName = ref<string>(auth.value?.lastName ?? "");
const firstName = ref<string>(auth.value?.firstName ?? "");
const lastNameKana = ref<string>(auth.value?.lastNameKana ?? "");
const firstNameKana = ref<string>(auth.value?.firstNameKana ?? "");
const gender = ref<string>(auth.value?.gender ?? "");
const dateOfBirth = ref<string>(auth.value?.dateOfBirth ?? "");
const tel = ref<string>(auth.value?.tel ?? "");
const email = ref<string>(auth.value?.email ?? "");
const postalCode = ref<string>(auth.value?.postalCode ?? "");
const prefecture = ref<string>(auth.value?.prefecture ?? "");
const city = ref<string>(auth.value?.city ?? "");
const town = ref<string>(auth.value?.town ?? "");
const building = ref<string>(auth.value?.building ?? "");
const genreIds = ref<string[]>(
  auth.value?.genres.map((genre: Genre) => genre.id) ?? []
);

const onSave = async () => {
  const isValid = (await formElement.value?.validate())?.valid;
  if (isValid) {
    const formData = new FormData();
    if (file.value) {
      formData.append("file", file.value);
    }
    formData.append("is_remove_image", isRemoveImage.value.toString());
    formData.append("nickname", nickname.value);
    formData.append("last_name", lastName.value);
    formData.append("first_name", firstName.value);
    formData.append("last_name_kana", lastNameKana.value);
    formData.append("first_name_kana", firstNameKana.value);
    formData.append("gender", gender.value);
    formData.append("date_of_birth", dateOfBirth.value);
    formData.append("tel", tel.value);
    formData.append("postal_code", postalCode.value);
    formData.append("prefecture", prefecture.value);
    formData.append("city", city.value);
    formData.append("town", town.value);
    formData.append("building", building.value);
    genreIds.value.forEach((genreId: string) => {
      formData.append("genre_ids[]", genreId);
    });
    emits("save", formData);
  }
};

const onSelectedImage = () => {
  if (file.value) {
    previewUrl.value = URL.createObjectURL(file.value);
    isRemoveImage.value = false;
  }
};

const onClearImage = () => {
  file.value = null;
  previewUrl.value = auth.value?.image ?? null;
};

const onRemoveImage = () => {
  file.value = null;
  previewUrl.value = null;
  isRemoveImage.value = true;
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
    <div class="flex flex-col items-center justify-center mt-3">
      <v-avatar v-if="previewUrl" size="120" class="mb-3">
        <v-img :src="previewUrl" :alt="auth?.nickname ?? 'ニックネーム'" />
      </v-avatar>
      <v-icon v-else size="130" color="primary">mdi-account-circle</v-icon>

      <v-file-input
        v-model="file"
        label="アバター画像を選択"
        variant="underlined"
        hide-details="auto"
        accept="image/*"
        prepend-icon=""
        prepend-inner-icon="mdi-camera"
        append-icon="mdi-image-off-outline"
        class="mb-2"
        width="320"
        @change="onSelectedImage"
        @click:clear="onClearImage"
        @click:append="onRemoveImage"
      ></v-file-input>
    </div>

    <v-text-field
      v-model="nickname"
      label="ニックネーム"
      type="text"
      variant="underlined"
      placeholder="ヤマダ"
      hide-details="auto"
      bg-color="white"
      class="mb-2"
      :error="!!errors.nickname"
      :error-messages="errors.nickname"
      :rules="[
        (v) => requiredRule(v, 'ニックネーム'),
        (v) => maxLengthRule(v, 100, 'ニックネーム'),
      ]"
    ></v-text-field>
    <v-row no-gutters>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="lastName"
          label="苗字"
          type="text"
          variant="underlined"
          placeholder="山田"
          hide-details="auto"
          bg-color="white"
          class="mb-2 sm:mr-1"
          :error="!!errors.lastName"
          :error-messages="errors.lastName"
          :rules="[
            (v) => requiredRule(v, '苗字'),
            (v) => maxLengthRule(v, 100, '苗字'),
          ]"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="firstName"
          label="名前"
          type="text"
          variant="underlined"
          placeholder="太郎"
          hide-details="auto"
          bg-color="white"
          class="mb-2 sm:ml-1"
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
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="lastNameKana"
          label="ミョウジ"
          type="text"
          variant="underlined"
          placeholder="ヤマダ"
          hide-details="auto"
          bg-color="white"
          class="mb-2 sm:mr-1"
          :error="!!errors.lastNameKana"
          :error-messages="errors.lastNameKana"
          :rules="[
            (v) => requiredRule(v, 'ミョウジ'),
            (v) => maxLengthRule(v, 100, 'ミョウジ'),
          ]"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="firstNameKana"
          label="ナマエ"
          type="text"
          variant="underlined"
          placeholder="タロウ"
          hide-details="auto"
          bg-color="white"
          class="mb-2 sm:ml-1"
          :error="!!errors.firstNameKana"
          :error-messages="errors.firstNameKana"
          :rules="[
            (v) => requiredRule(v, 'ナマエ'),
            (v) => maxLengthRule(v, 100, 'ナマエ'),
          ]"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-label class="mt-2">性別</v-label>
    <v-radio-group
      v-model="gender"
      hide-details="auto"
      inline
      class="mb-2"
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

    <v-text-field
      v-model="dateOfBirth"
      label="生年月日"
      type="date"
      variant="underlined"
      placeholder=""
      hide-details="auto"
      bg-color="white"
      class="mb-2"
      :error="!!errors.dateOfBirth"
      :error-messages="errors.dateOfBirth"
      :rules="[]"
    ></v-text-field>
    <v-text-field
      v-model="tel"
      label="電話番号"
      type="text"
      variant="underlined"
      placeholder="09010101010"
      hide-details="auto"
      bg-color="white"
      class="mb-2"
      :error="!!errors.tel"
      :error-messages="errors.tel"
      :rules="[
        (v) => requiredRule(v, '電話番号'),
        (v) => telRule(v, '電話番号'),
      ]"
    ></v-text-field>

    <v-text-field
      v-model="email"
      label="メールアドレス"
      type="email"
      variant="underlined"
      placeholder="example@versionx.jp"
      hide-details="auto"
      bg-color="white"
      class=""
      disabled
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
      variant="underlined"
      hide-details="auto"
      bg-color="white"
      class="mb-2"
      :error="!!errors.prefecture"
      :error-messages="errors.prefecture"
      :rules="[(v) => requiredRule(v, '都道府県')]"
    ></v-autocomplete>
    <v-text-field
      v-model="city"
      label="市区町村"
      type="text"
      variant="underlined"
      placeholder="浜松市中央区"
      hide-details="auto"
      bg-color="white"
      class="mb-2"
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
      type="text"
      variant="underlined"
      placeholder="板屋町102-15"
      hide-details="auto"
      bg-color="white"
      class="mb-2"
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
      type="text"
      variant="underlined"
      placeholder="河合ビル"
      hide-details="auto"
      bg-color="white"
      class="mb-2"
      :error="!!errors.building"
      :error-messages="errors.building"
      :rules="[(v) => maxLengthRule(v, 250, '建物名、部屋番号等')]"
    ></v-text-field>

    <v-label class="mt-2">ジャンル</v-label>
    <v-chip-group v-model="genreIds" column multiple>
      <v-chip
        v-for="genre in genres"
        :key="genre.id"
        :text="genre.name"
        :value="genre.id"
        :color="genre.color"
        filter
      ></v-chip>
    </v-chip-group>

    <v-btn
      color="primary"
      size="large"
      variant="elevated"
      class="mt-2"
      block
      @click="onSave"
      :loading="isLoading"
    >
      更新
    </v-btn>
  </v-form>
</template>
