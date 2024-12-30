<script setup lang="ts">
import { VForm } from "vuetify/components";
import type { Worker } from "@/interface/entities/Worker";
import type { User } from "@/interface/entities/User";

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
const { chat } = useChat();
const { workers, all: workerAll } = useWorker();
const { users, all: userAll } = useUser();
const { courses, all: courseAll } = useCourse();
const { lessons, all: lessonAll } = useLesson();
const { errors } = useErrors();
const { requiredRule, maxLengthRule } = validationRules();

await useAsyncData("allWorkerData", async () => {
  await workerAll({});
  return { workers: workers.value };
});

await useAsyncData("allUserData", async () => {
  await userAll({});
  return { users: users.value };
});

await useAsyncData("allCourseData", async () => {
  await courseAll({});
  return { courses: courses.value };
});

await useAsyncData("allLessonData", async () => {
  await lessonAll({});
  return { lessons: lessons.value };
});

const formElement = ref<VForm>();
const name = ref<string>(chat.value?.name ?? "");
const workerIds = ref<string[]>(chat.value?.workers.map((worker: Worker) => worker.id) ?? []);
const userIds = ref<string[]>(chat.value?.users.map((user: User) => user.id) ?? []);
const workerId = ref<string>("");
const userId = ref<string>("");
const isGroup = ref<boolean>(true);
const isWorker = ref<boolean>(true);
const isFilter = ref<boolean>(false);
const courseId = ref<string>();
const lessonId = ref<string>();

const onSave = async () => {
  // const isValid = (await formElement.value?.validate())?.valid;
  const isValid =  true
  if (isValid) {
    const params = {
      name: name.value,
      is_group: isGroup.value,
      worker_ids: workerIds.value,
      user_ids: userIds.value,
      is_worker: isWorker.value,
      worker_id: workerId.value,
      user_id: userId.value,
    };
    emits("save", params);
  }
};
</script>

<template>
  <v-form ref="formElement">
    <v-radio-group v-model="isGroup" inline>
      <v-radio label="チャットグループ" :value="true"></v-radio>
      <v-radio label="ダイレクトメッセージ" :value="false"></v-radio>
    </v-radio-group>

    <template v-if="isGroup">
      <v-text-field
        v-model="name"
        label="チャットグループ名"
        placeholder="チャットグループA"
        variant="outlined"
        density="compact"
        hide-details="auto"
        bg-color="white"
        class="mb-3"
        :error="!!errors.name"
        :error-messages="errors.name"
        :rules="[
          (v) => requiredRule(v, 'チャットグループ名'),
          (v) => maxLengthRule(v, 100, 'チャットグループ名'),
        ]"
      ></v-text-field>

      <v-label class="mb-3">チャットメンバー選択</v-label>
      <v-autocomplete
        v-model="workerIds"
        label="講師"
        :items="workers.filter((worker) => worker.id !== auth?.id)"
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
        :rules="[]"
      ></v-autocomplete>
      <v-autocomplete
        v-model="userIds"
        label="契約者"
        :items="users"
        item-title="fullName"
        item-value="id"
        variant="outlined"
        density="compact"
        hide-details="auto"
        bg-color="white"
        :loading="isLoading"
        multiple
        class="mb-3"
        :error="!!errors.userIds"
        :error-messages="errors.userIds"
        :rules="[
          (v) => requiredRule(v, '契約者'),
        ]"
      >
        <template v-slot:append>
          <v-btn
            icon
            variant="text"
            density="comfortable"
            color=""
            @click="isFilter = !isFilter"
          >
            <v-icon size="small">mdi-filter-outline</v-icon>
          </v-btn>
        </template>
      </v-autocomplete>

      <template v-if="isFilter">
        <v-label class="mb-3">
          <p class="text-xs">絞り込み条件</p>
        </v-label>
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
        ></v-autocomplete>

        <v-autocomplete
          v-model="lessonId"
          label="レッスン"
          :items="lessons"
          item-title="name"
          item-value="id"
          variant="outlined"
          density="compact"
          hide-details="auto"
          bg-color="white"
          class="mb-3"
        ></v-autocomplete>
      </template>
    </template>

    <template v-else>
      <v-radio-group v-model="isWorker" density="comfortable" inline>
        <v-radio label="講師" :value="true"></v-radio>
        <v-radio label="契約者" :value="false"></v-radio>
      </v-radio-group>
      <v-autocomplete
        v-if="isWorker"
        v-model="workerId"
        label="講師"
        :items="workers"
        item-title="fullName"
        item-value="id"
        variant="outlined"
        density="compact"
        hide-details="auto"
        bg-color="white"
        class="mb-3"
        :error="!!errors.workerId"
        :error-messages="errors.workerId"
        :rules="[
          (v) => requiredRule(v, '講師'),
        ]"
      >
      </v-autocomplete>
      <v-autocomplete
        v-else
        v-model="userId"
        label="契約者"
        :items="users"
        item-title="fullName"
        item-value="id"
        variant="outlined"
        density="compact"
        hide-details="auto"
        bg-color="white"
        class="mb-3"
        :error="!!errors.userId"
        :error-messages="errors.userId"
        :rules="[
          (v) => requiredRule(v, '契約者'),
        ]"
      >
      </v-autocomplete>
    </template>

    <v-btn
      color="primary"
      size="large"
      variant="elevated"
      class="mt-4"
      block
      @click="onSave"
      :loading="isLoading"
    >
      {{ chat ? "更新" : (isGroup ? "チャットグループ作成" : "チャット開始") }}
    </v-btn>
  </v-form>
</template>
