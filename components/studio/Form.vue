<script setup lang="ts">
import { VForm } from "vuetify/components";
import { prefectures } from "@/composables/constants/prefectures";
import type { Factory } from "@/interface/entities/Factory";
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

const { studio } = useStudio();
const { factories, all: factoryAll } = useFactory();
const { genres, all: genreAll } = useGenre();
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

await useAsyncData("allFactoryData", async () => {
  await factoryAll({});
  return { factories: factories.value };
});

await useAsyncData("allGenreData", async () => {
  await genreAll({});
  return { genres: genres.value };
});

const formElement = ref<VForm>();
const file = ref<File | null>(null);
const previewUrl = ref<string | null>(studio.value?.image ?? null);
const isRemoveImage = ref<boolean>(false);
const name = ref<string>(studio.value?.name ?? "");
const description = ref<string>(studio.value?.description ?? "");
const tel = ref<string>(studio.value?.tel ?? "");
const email = ref<string>(studio.value?.email ?? "");
const postalCode = ref<string>(studio.value?.postalCode ?? "");
const prefecture = ref<string>(studio.value?.prefecture ?? "");
const city = ref<string>(studio.value?.city ?? "");
const town = ref<string>(studio.value?.town ?? "");
const building = ref<string>(studio.value?.building ?? "");
const factoryIds = ref<string[]>(
  studio.value?.factories.map((factory: Factory) => factory.id) ?? []
);
const genreIds = ref<string[]>(
  studio.value?.genres.map((genre: Genre) => genre.id) ?? []
);

const onSave = async () => {
  const isValid = (await formElement.value?.validate())?.valid;
  if (isValid) {
    const formData = new FormData();
    if (file.value) {
      formData.append("file", file.value);
    }
    formData.append("is_remove_image", isRemoveImage.value.toString());
    formData.append("name", name.value);
    formData.append("description", description.value);
    formData.append("tel", tel.value);
    formData.append("email", email.value);
    formData.append("postal_code", postalCode.value);
    formData.append("prefecture", prefecture.value);
    formData.append("city", city.value);
    formData.append("town", town.value);
    formData.append("building", building.value);
    factoryIds.value.forEach((factoryId: string) => {
      formData.append("factory_ids[]", factoryId);
    });
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
  previewUrl.value = studio.value?.image ?? null;
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
    <v-text-field
      v-model="name"
      label="スタジオ名"
      placeholder="スタジオA"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3"
      :error="!!errors.name"
      :error-messages="errors.name"
      :rules="[
        (v) => requiredRule(v, 'スタジオ名'),
        (v) => maxLengthRule(v, 100, 'スタジオ名'),
      ]"
    ></v-text-field>
    <v-textarea
      v-model="description"
      label="説明"
      placeholder="説明"
      rows="3"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3"
      :error="!!errors.description"
      :error-messages="errors.description"
      :rules="[(v) => maxLengthRule(v, 500, '説明')]"
    ></v-textarea>
    <v-img
      v-if="previewUrl"
      :src="previewUrl"
      alt="サムネイル"
      max-height="250"
      cover
      class="mb-3"
    />
    <v-file-input
      v-model="file"
      label="サムネイル画像を選択"
      variant="outlined"
      density="compact"
      hide-details="auto"
      accept="image/*"
      prepend-icon=""
      prepend-inner-icon="mdi-camera"
      append-icon="mdi-image-off-outline"
      class="mb-3"
      @change="onSelectedImage"
      @click:clear="onClearImage"
      @click:append="onRemoveImage"
    ></v-file-input>
    <v-text-field
      v-model="tel"
      label="電話番号"
      placeholder="09010101010"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3"
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
      placeholder="example@versionx.jp"
      type="email"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class=""
      :error="!!errors.email"
      :error-messages="errors.email"
      :rules="[
        (v) => requiredRule(v, 'メールアドレス'),
        (v) => emailRule(v, 'メールアドレス'),
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
    <v-label class="">設備・備品</v-label>
    <v-chip-group v-model="factoryIds" column multiple>
      <v-chip
        v-for="factory in factories"
        :key="factory.id"
        :text="factory.name"
        :value="factory.id"
        :color="factory.color"
        filter
      ></v-chip>
    </v-chip-group>
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
      {{ studio ? "更新" : "新規登録" }}
    </v-btn>
  </v-form>
</template>

<style scoped>
.v-list-item {
  padding-inline-start: 0 !important;
}
</style>
