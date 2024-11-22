<script setup lang="ts">
import { VForm } from "vuetify/components";
import type { Worker } from "@/interface/entities/Worker";
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

const { course } = useCourse();
const { studios, all: studioAll } = useStudio();
const { workers, all: workerAll } = useWorker();
const { genres, all: genreAll } = useGenre();
const { errors } = useErrors();
const { requiredRule, maxLengthRule } = validationRules();

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
const studioId = ref<string>(course.value?.studioId ?? "");
const workerIds = ref<string[]>(course.value?.workers.map((worker: Worker) => worker.id) ?? []);
const genreIds = ref<string[]>(course.value?.genres.map((genre: Genre) => genre.id) ?? []);

const onSave = async () => {
  const isValid = (await formElement.value?.validate())?.valid;
  if (isValid) {
    const formData = new FormData();
    if (file.value) {
      formData.append('file', file.value);
    }
    formData.append('is_remove_image', isRemoveImage.value.toString())
    formData.append('name', name.value)
    formData.append('description', description.value)
    formData.append("studio_id", studioId.value);
    workerIds.value.forEach((workerId: string) => {
      formData.append("worker_ids[]", workerId);
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
  previewUrl.value = course.value?.image ?? null;
};

const onRemoveImage = () => {
  file.value = null;
  previewUrl.value = null;
  isRemoveImage.value = true;
};
</script>

<template>
  <v-form ref="formElement">
    <v-text-field
      v-model="name"
      label="コース名"
      type="text"
      variant="underlined"
      placeholder="コースA"
      hide-details="auto"
      bg-color="white"
      class="mb-2"
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
      rows="3"
      variant="underlined"
      placeholder="説明"
      hide-details="auto"
      bg-color="white"
      class="mb-2"
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
      class="mb-1"
    />
    <v-file-input
      v-model="file"
      label="サムネイル画像を選択"
      variant="underlined"
      hide-details="auto"
      accept="image/*"
      prepend-icon=""
      prepend-inner-icon="mdi-camera"
      append-icon="mdi-image-off-outline"
      class="mb-2"
      @change="onSelectedImage"
      @click:clear="onClearImage"
      @click:append="onRemoveImage"
    ></v-file-input>
    <v-autocomplete
      v-model="studioId"
      label="スタジオ"
      :items="studios"
      item-title="name"
      item-value="id"
      variant="underlined"
      hide-details="auto"
      bg-color="white"
      class="mb-2"
      :error="!!errors.studioId"
      :error-messages="errors.studioId"
      :rules="[(v) => requiredRule(v, 'スタジオ')]"
    ></v-autocomplete>
    <v-autocomplete
      v-model="workerIds"
      label="講師"
      :items="workers"
      item-title="fullName"
      item-value="id"
      variant="underlined"
      hide-details="auto"
      bg-color="white"
      multiple
      class="mb-2"
      :error="!!errors.workerIds"
      :error-messages="errors.workerIds"
    ></v-autocomplete>
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
      {{ course ? "更新" : "新規登録" }}
    </v-btn>
  </v-form>
</template>
