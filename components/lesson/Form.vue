<script setup lang="ts">
import { VForm } from "vuetify/components";
import type { Worker } from "@/interface/entities/Worker";

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
const { lesson } = useLesson();
const { courses, all: courseAll } = useCourse();
const { workers, all: workerAll } = useWorker();
const { rooms, all: roomAll } = useRoom();
const { errors } = useErrors();
const { requiredRule, maxLengthRule, maxTimeRule, minTimeRule } = validationRules();
const { showSnackbar } = useSnackbar();

await useAsyncData("allCourseData", async () => {
  await courseAll({});
  return { courses: courses.value };
});

await useAsyncData("allWorkerData", async () => {
  await workerAll({});
  return { workers: workers.value };
});

await useAsyncData("allRoomData", async () => {
  await roomAll({});
  return { rooms: rooms.value };
});

const formElement = ref<VForm>();
const name = ref<string>(lesson.value?.name ?? "");
const description = ref<string>(lesson.value?.description ?? "");
const dayOfWeek = ref<string>(lesson.value?.dayOfWeek ?? "");
const startTime = ref<string>(lesson.value?.startTime ?? "");
const endTime = ref<string>(lesson.value?.endTime ?? "");
const courseId = ref<string>(lesson.value?.courseId ?? (route.query.courseId ? String(route.query.courseId) : ""));
const roomId = ref<string>(lesson.value?.roomId ?? (route.query.roomId ? String(route.query.roomId) : ""));
const workerIds = ref<string[]>(lesson.value?.workers.map((worker: Worker) => worker.id) ?? (route.query.workerId ? [String(route.query.workerId)] : []));

const onSave = async () => {
  const isValid = (await formElement.value?.validate())?.valid;
  if (isValid) {
    const params = {
      name: name.value,
      description: description.value,
      day_of_week: dayOfWeek.value,
      start_time: startTime.value,
      end_time: endTime.value,
      course_id: courseId.value,
      room_id: roomId.value,
      worker_ids: workerIds.value,
    };
    emits("save", params);
  } else {
    showSnackbar("入力内容を確認してください", "error");
  }
};
</script>

<template>
  <v-form ref="formElement">
    <v-text-field
      v-model="name"
      label="レッスン名"
      placeholder="レッスンA"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3"
      :error="!!errors.name"
      :error-messages="errors.name"
      :rules="[
        (v) => requiredRule(v, 'レッスン名'),
        (v) => maxLengthRule(v, 100, 'レッスン名'),
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
    <v-autocomplete
      v-model="courseId"
      label="コース"
      :items="courses"
      item-title="name"
      item-value="id"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3"
      :error="!!errors.courseId"
      :error-messages="errors.courseId"
      :rules="[(v) => requiredRule(v, 'コース')]"
    ></v-autocomplete>
    <v-label class="mt-2">曜日</v-label>
    <v-radio-group
      v-model="dayOfWeek"
      inline
      density="compact"
      hide-details="auto"
      class="mb-3"
      :error="!!errors.dayOfWeek"
      :error-messages="errors.dayOfWeek"
      :rules="[(v) => requiredRule(v, '曜日')]"
    >
      <v-radio
        v-for="item in [
          { key: 'mon', label: '月' },
          { key: 'tue', label: '火' },
          { key: 'wed', label: '水' },
          { key: 'thu', label: '木' },
          { key: 'fri', label: '金' },
          { key: 'sat', label: '土' },
          { key: 'sun', label: '日' },
        ]"
        :key="item.key"
        :label="item.label"
        :value="item.key"
        class="mr-2"
      ></v-radio>
    </v-radio-group>
    <div class="flex items-start">
      <v-text-field
        v-model="startTime"
        label="開始時間"
        placeholder=""
        type="time"
        variant="outlined"
        density="compact"
        hide-details="auto"
        bg-color="white"
        class="mb-3 max-w-[50%]"
        :error="!!errors.startTime"
        :error-messages="errors.startTime"
        :rules="[
          (v) => requiredRule(v, '開始時間'),
          (v) => (endTime ? maxTimeRule(v, endTime, '開始時間') : true),
        ]"
      ></v-text-field>
      <v-label class="m-2">〜</v-label>
      <v-text-field
        v-model="endTime"
        label="終了時間"
        placeholder=""
        type="time"
        variant="outlined"
        density="compact"
        hide-details="auto"
        bg-color="white"
        class="mb-3 max-w-[50%]"
        :error="!!errors.endTime"
        :error-messages="errors.endTime"
        :rules="[
          (v) => requiredRule(v, '終了時間'),
          (v) => (startTime ? minTimeRule(v, startTime, '終了時間') : true),
        ]"
      ></v-text-field>
    </div>
    <v-autocomplete
      v-model="workerIds"
      label="講師"
      :items="workers"
      item-title="fullName"
      item-value="id"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      multiple
      class="mb-3"
      :error="!!errors.workerIds"
      :error-messages="errors.workerIds"
    ></v-autocomplete>
    <v-autocomplete
      v-model="roomId"
      label="ルーム"
      :items="rooms"
      item-title="name"
      item-value="id"
      variant="outlined"
      density="compact"
      hide-details="auto"
      bg-color="white"
      class="mb-3"
      :error="!!errors.roomId"
      :error-messages="errors.roomId"
    ></v-autocomplete>
    <v-btn
      color="primary"
      size="large"
      variant="elevated"
      class="mt-4"
      block
      @click="onSave"
      :loading="isLoading"
    >
      {{ lesson ? "更新" : "新規登録" }}
    </v-btn>
  </v-form>
</template>
