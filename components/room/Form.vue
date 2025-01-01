<script setup lang="ts">
import { VForm } from "vuetify/components";
import type { Factory } from "@/interface/entities/Factory";

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
const { room } = useRoom();
const { studios, all: studioAll } = useStudio();
const { factories, all: factoryAll } = useFactory();
const { errors } = useErrors();
const { requiredRule, maxLengthRule, minNumberRule, maxNumberRule } = validationRules();
const { showSnackbar } = useSnackbar();

await useAsyncData("allStudioData", async () => {
  await studioAll({});
  return { studios: studios.value };
});

await useAsyncData("allFactoryData", async () => {
  await factoryAll({});
  return { factories: factories.value };
});

const formElement = ref<VForm>();
const file = ref<File | null>(null);
const previewUrl = ref<string | null>(room.value?.image ?? null);
const isRemoveImage = ref<boolean>(false);
const name = ref<string>(room.value?.name ?? "");
const description = ref<string>(room.value?.description ?? "");
const capacity = ref<number | null>(room.value?.capacity ?? null);
const studioId = ref<string>(room.value?.studio?.id ?? (String(route.query.studioId ?? "")));
const factoryIds = ref<string[]>(room.value?.factories.map((factory: Factory) => factory.id) ?? []);

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
    factoryIds.value.forEach((factoryId: string) => {
      formData.append("factory_ids[]", factoryId);
    });
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
</script>

<template>
  <v-form ref="formElement">
    <v-text-field
      v-model="name"
      label="ルーム名"
      placeholder="ルームA"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3"
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
      v-model="studioId"
      label="スタジオ"
      :items="studios"
      item-title="name"
      item-value="id"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3"
      :error="!!errors.studioId"
      :error-messages="errors.studioId"
      :rules="[(v) => requiredRule(v, 'スタジオ')]"
    ></v-autocomplete>
    <v-text-field
      v-model="capacity"
      label="収容人数"
      placeholder="10"
      type="number"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3"
      :error="!!errors.capacity"
      :error-messages="errors.capacity"
      :rules="[
        (v) => minNumberRule(v, 1, '収容人数'),
        (v) => maxNumberRule(v, 10000, '収容人数'),
      ]"
    ></v-text-field>
    <v-label class="mt-2">設備・備品</v-label>
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
