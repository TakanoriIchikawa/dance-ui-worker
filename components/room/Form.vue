<script setup lang="ts">
import { VForm } from "vuetify/components";

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

const { room } = useRoom();
const { studios, all } = useStudio();
const { errors } = useErrors();
const { requiredRule, maxLengthRule, minNumberRule, maxNumberRule } =
  validationRules();

await useAsyncData("allStudioData", async () => {
  await all({});
  return { studios: studios.value };
});

const formElement = ref<VForm>();
const file = ref<File | null>(null);
const previewUrl = ref<string | null>(room.value?.image ?? null);
const isRemoveImage = ref<boolean>(false);
const name = ref<string>(room.value?.name ?? "");
const description = ref<string>(room.value?.description ?? "");
const capacity = ref<number | null>(room.value?.capacity ?? null);
const studioId = ref<string>(room.value?.studio?.id ?? "");

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
    formData.append("capacity", capacity.value?.toString() ?? "");
    formData.append("studio_id", studioId.value);

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
      label="ルーム名"
      type="text"
      variant="underlined"
      placeholder="ルームA"
      hide-details="auto"
      bg-color="white"
      class="mb-2"
      :error="!!errors.name"
      :error-messages="errors.name"
      :rules="[
        (v) => requiredRule(v, 'ルーム名'),
        (v) => maxLengthRule(v, 100, 'ルーム名'),
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
    <v-text-field
      v-model="capacity"
      label="収容人数"
      type="number"
      variant="underlined"
      placeholder="10"
      hide-details="auto"
      bg-color="white"
      class="mb-2"
      :error="!!errors.capacity"
      :error-messages="errors.capacity"
      :rules="[
        (v) => minNumberRule(v, 1, '収容人数'),
        (v) => maxNumberRule(v, 10000, '収容人数'),
      ]"
    ></v-text-field>
    <v-btn
      color="primary"
      size="large"
      variant="elevated"
      class="mt-4"
      block
      @click="onSave"
      :loading="isLoading"
    >
      {{ room ? "更新" : "新規登録" }}
    </v-btn>
  </v-form>
</template>
