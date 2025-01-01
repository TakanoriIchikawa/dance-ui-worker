<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import { useDisplay } from "vuetify";
import type { Dayjs } from "dayjs";
import type { EventInput } from "@fullcalendar/core";
import type { ErrorResponse } from "@/types/api/ErrorResponse";

const route = useRoute();
const router = useRouter();
const { lesson, find, destroy } = useLesson();
const { showSnackbar } = useSnackbar();
const { breadcrumbs } = useBreadcrumbs();
const { smAndDown, mdAndUp } = useDisplay();
const isLoading = ref<boolean>(false);
const isDialog = ref<boolean>(false);

const lessonId = computed((): string => {
  return String(route.params.id);
});

await useAsyncData("findLessonData", async () => {
  await find(lessonId.value);
  return { lesson: lesson.value };
});

if (!lesson.value) {
  throw createError({ statusCode: 404 });
}

const onDestroy = async () => {
  isLoading.value = true;
  await destroy(lessonId.value)
    .then(() => {
      showSnackbar("レッスンの削除に成功しました", "primary");
      router.push("/lesson");
    })
    .catch((errorResponse: ErrorResponse) => {
      showSnackbar(errorResponse.data.message, "error");
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const events = ref<EventInput[]>([
  {
    title: "event 1",
    date: "2024-11-09",
    start: "2024-11-09 20:00",
    end: "2024-11-09 21:00",
  },
  { title: "event 2", date: "2024-11-17" },
]);

const onAddSchedule = (title: string, start: Dayjs, end: Dayjs) => {
  console.log("スケジュール追加");
  events.value.push({
    title: title,
    start: start.format("YYYY-MM-DD HH:mm"),
    end: end.format("YYYY-MM-DD HH:mm"),
  });
};

const onEditSchedule = (title: string, start: Dayjs, end: Dayjs) => {
  console.log("スケジュール更新");
};

breadcrumbs.value = [
  { title: "ホーム", to: "/" },
  { title: "レッスン", to: "/lesson" },
  { title: lesson.value?.name ?? "", to: `/lesson/${lessonId.value}` },
];
</script>

<template>
  <v-row justify="center" justify-xl="start">
    <v-col cols="12" sm="10" md="9" lg="8" xl="7">
      <v-card class="relative">
        <div
          v-if="mdAndUp"
          class="absolute top-0 right-0 z-10 flex justify-end"
        >
          <v-btn
            class=""
            size="48"
            variant="text"
            color="blue"
            min-width="100"
            @click="router.push(`/lesson/${lessonId}/edit`)"
          >
            <v-icon size="20">mdi-pencil</v-icon>
            <span class="text-base">編集</span>
          </v-btn>
          <v-dialog v-model="isDialog" max-width="400">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                v-bind="activatorProps"
                class=""
                size="48"
                variant="text"
                color="error"
                min-width="100"
              >
                <v-icon size="20">mdi-trash-can</v-icon>
                <span class="text-base">削除</span>
              </v-btn>
            </template>

            <v-card>
              <v-card-text> {{ lesson?.name }}を削除しますか？ </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  text="削除"
                  color="error"
                  width="90"
                  @click="onDestroy"
                ></v-btn>
                <v-btn
                  text="キャンセル"
                  width="90"
                  @click="isDialog = false"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <v-card-title>
          {{ lesson?.name }}
        </v-card-title>
        <v-card-subtitle>
          <p class="text-base whitespace-pre-wrap">{{ lesson?.description }}</p>
        </v-card-subtitle>
        <v-card-text>
          <v-list lines="one">
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">コース</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                <v-btn
                  variant="text"
                  density="compact"
                  size="large"
                  slim
                  :to="`/course/${lesson?.courseId}`"
                >
                  {{ lesson?.course?.name }}
                </v-btn>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">曜日</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ lesson?.dayOfWeekText }}曜日
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">時間</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ lesson?.startTime }} 〜 {{ lesson?.endTime }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">担当講師</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                <div class="flex flex-wrap ga-2 mt-2 mb-1">
                  <v-chip
                    color=""
                    v-for="worker in lesson?.workers"
                    :key="worker.id"
                    :to="`/worker/${worker?.id}`"
                  >
                    <v-avatar size="24" start>
                      <v-img
                        v-if="worker.image"
                        :src="worker.image"
                        :alt="
                          worker.nickname ? worker.nickname : 'ニックネーム'
                        "
                        size="28"
                      />
                      <v-icon v-else size="28" color="primary"
                        >mdi-account-circle</v-icon
                      >
                    </v-avatar>
                    <span>{{
                      worker.nickname ? worker.nickname : worker.fullName
                    }}</span>
                  </v-chip>
                </div>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">ルーム</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                <v-btn
                  variant="text"
                  density="compact"
                  size="large"
                  slim
                  :to="`/room/${lesson?.roomId}`"
                >
                  {{ lesson?.room?.name }}
                </v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="10" md="9" lg="8" xl="7">
      <v-sheet class="p-3">
        <CommonCalendar
          :events="events"
          @addSchedule="onAddSchedule"
          @editSchedule="onEditSchedule"
        ></CommonCalendar>
      </v-sheet>
    </v-col>

    <v-btn
      v-if="smAndDown"
      position="fixed"
      location="bottom right"
      icon="mdi-pencil"
      class="mr-20 mb-15"
      size="48"
      color="primary"
      elevation="8"
      @click="router.push(`/lesson/${lessonId}/edit`)"
    />

    <v-dialog v-model="isDialog" max-width="400">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          v-if="smAndDown"
          v-bind="activatorProps"
          position="fixed"
          location="bottom right"
          icon="mdi-trash-can"
          class="mr-5 mb-15"
          size="48"
          color="error"
          elevation="8"
        />
      </template>

      <v-card>
        <v-card-text> {{ lesson?.name }}を削除しますか？ </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text="削除"
            color="error"
            width="90"
            @click="onDestroy"
          ></v-btn>
          <v-btn text="キャンセル" width="90" @click="isDialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped>
.v-list-item {
  padding-inline-start: 0 !important;
}
</style>
