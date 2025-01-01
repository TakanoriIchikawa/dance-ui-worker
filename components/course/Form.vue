<script setup lang="ts">
import { VForm } from "vuetify/components";
import type { Studio } from "@/interface/entities/Studio";
import type { Worker } from "@/interface/entities/Worker";
import type { Genre } from "@/interface/entities/Genre";
import type { MultipleLessonPrice } from "@/interface/entities/MultipleLessonPrice";

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

const route = useRoute();
const { course } = useCourse();
const { studios, all: studioAll } = useStudio();
const { workers, all: workerAll } = useWorker();
const { genres, all: genreAll } = useGenre();
const { errors } = useErrors();
const { requiredRule, maxLengthRule } = validationRules();
const { showSnackbar } = useSnackbar();

await useAsyncData("allStudioData", async () => {
  await studioAll({});
  return { studios: studios.value };
});

await useAsyncData("allWorkerData", async () => {
  await workerAll({});
  return { workers: workers.value };
});

await useAsyncData("allGenreData", async () => {
  await genreAll({});
  return { genres: genres.value };
});

const formElement = ref<VForm>();
const file = ref<File | null>(null);
const previewUrl = ref<string | null>(course.value?.image ?? null);
const isRemoveImage = ref<boolean>(false);
const name = ref<string>(course.value?.name ?? "");
const description = ref<string>(course.value?.description ?? "");
const price = ref<number>(course.value?.price ?? 0);
const isMultipleLessonPrice = ref<boolean>(course.value?.isMultipleLessonPrice ?? false)
const multipleLessonPrices = ref<Partial<MultipleLessonPrice>[]>(course.value?.multipleLessonPrices ?? [{}])
const studioIds = ref<string[]>(course.value?.studios.map((studio: Studio) => studio.id) ?? (route.query.studioId ? [String(route.query.studioId)] : []));
const workerIds = ref<string[]>(course.value?.workers.map((worker: Worker) => worker.id) ?? (route.query.workerId ? [String(route.query.workerId)] : []));
const genreIds = ref<string[]>(course.value?.genres.map((genre: Genre) => genre.id) ?? []);

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
    formData.append("price", String(price.value));
    formData.append("is_multiple_lesson_price", String(isMultipleLessonPrice.value));
    studioIds.value.forEach((studioId: string) => { formData.append("studio_ids[]", studioId) });
    workerIds.value.forEach((workerId: string) => { formData.append("worker_ids[]", workerId) });
    genreIds.value.forEach((genreId: string) => { formData.append("genre_ids[]", genreId) });
    multipleLessonPrices.value.forEach((multipleLessonPrice: Partial<MultipleLessonPrice>) => { formData.append("multiple_lesson_prices[]", JSON.stringify({ name: multipleLessonPrice.name, lesson_count: multipleLessonPrice.lessonCount, price: multipleLessonPrice.price})) });
    emits("save", formData);
  } else {
    showSnackbar("入力内容を確認してください", "error");
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
  previewUrl.value = course.value?.image ?? null;
};

const onRemoveImage = () => {
  file.value = null;
  previewUrl.value = null;
  isRemoveImage.value = true;
};

const addMultipleLessonPrice = () => {
  multipleLessonPrices.value.push({})
}

const removeMultipleLessonPrice = (index: number) => {
  multipleLessonPrices.value.splice(index, 1)
}
</script>

<template>
  <v-form ref="formElement">
    <v-text-field
      v-model="name"
      label="コース名"
      placeholder="コースA"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3"
      :error="!!errors.name"
      :error-messages="errors.name"
      :rules="[
        (v) => requiredRule(v, 'コース名'),
        (v) => maxLengthRule(v, 100, 'コース名'),
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
    <v-autocomplete
      v-model="studioIds"
      label="スタジオ"
      :items="studios"
      item-title="name"
      item-value="id"
      multiple
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3"
      :error="!!errors.studioIds"
      :error-messages="errors.studioIds"
      :rules="[(v) => requiredRule(v, 'スタジオ')]"
    ></v-autocomplete>
    <v-autocomplete
      v-model="workerIds"
      label="講師"
      :items="workers"
      item-title="fullName"
      item-value="id"
      multiple
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3"
      :error="!!errors.workerIds"
      :error-messages="errors.workerIds"
    ></v-autocomplete>
    <v-text-field
      v-model="price"
      label="料金"
      placeholder="5000"
      type="number"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3"
      :error="!!errors.name"
      :error-messages="errors.name"
      :rules="[
        (v) => requiredRule(v, '料金'),
      ]"
    ></v-text-field>

    <v-tooltip text="レッスンの個別申込が可能になります" location="top">
      <template v-slot:activator="{ props }">
        <v-checkbox
          v-bind="props"
          v-model="isMultipleLessonPrice"
          label="レッスン数に応じて料金を設定"
          :value="true"
          density="compact"
          hide-details="auto"
          bg-color="white"
          class="mb-3"
          width="260"
          :rules="[]"
        >
        </v-checkbox>
      </template>
    </v-tooltip>

    <template v-if="isMultipleLessonPrice">
      <v-row
        v-for="(multipleLessonPrice, multipleLessonPriceIndex) in multipleLessonPrices"
        :key="multipleLessonPriceIndex"
        dense
        align="start"
      >
        <v-col cols="4">
          <v-text-field
            v-model="multipleLessonPrice.name"
            label="パッケージ名"
            placeholder="週1レッスン"
            variant="underlined"
            density="compact"
            hide-details="auto"
            bg-color="white"
            class=""
            :error="!!errors.name"
            :error-messages="errors.name"
            :rules="[
              (v) => requiredRule(v, 'パッケージ名'),
            ]"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="multipleLessonPrice.lessonCount"
            label="レッスン数"
            placeholder="1"
            type="number"
            variant="underlined"
            density="compact"
            hide-details="auto"
            bg-color="white"
            class=""
            :error="!!errors.name"
            :error-messages="errors.name"
            :rules="[
              (v) => requiredRule(v, 'レッスン数'),
            ]"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="multipleLessonPrice.price"
            label="月額料金"
            placeholder="5000"
            type="number"
            variant="underlined"
            density="compact"
            hide-details="auto"
            bg-color="white"
            class=""
            :error="!!errors.name"
            :error-messages="errors.name"
            :rules="[
              (v) => requiredRule(v, '料金'),
            ]"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn icon color="error" variant="plain" @click="removeMultipleLessonPrice(multipleLessonPriceIndex)">
            <v-icon size="24">mdi-trash-can</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="2" offset="9">
          <v-btn
            class=""
            size="36"
            variant="text"
            color="primary"
            min-width="100"
            @click="addMultipleLessonPrice"
          >
            <v-icon size="20">mdi-plus</v-icon>
            <span class="text-base">追加</span>
          </v-btn>
        </v-col>
      </v-row>
      
    </template>

    <v-label class="">ジャンル</v-label>
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
      {{ course ? "更新" : "新規登録" }}
    </v-btn>
  </v-form>
</template>
