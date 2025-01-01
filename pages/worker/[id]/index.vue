<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import { useDisplay } from "vuetify";
import type { EventInput } from "@fullcalendar/core";
import type { ErrorResponse } from "@/types/api/ErrorResponse";

const route = useRoute();
const router = useRouter();
const { worker, find, destroy } = useWorker();
const { showSnackbar } = useSnackbar();
const { breadcrumbs } = useBreadcrumbs();
const { smAndDown, mdAndUp } = useDisplay();
const isLoading = ref<boolean>(false);
const isDialog = ref<boolean>(false);

const workerId = computed((): string => {
  return String(route.params.id);
});

await useAsyncData("findWorkerData", async () => {
  await find(workerId.value);
  return { worker: worker.value };
});

if (!worker.value) {
  throw createError({ statusCode: 404 });
}

const onDestroy = async () => {
  isLoading.value = true;
  await destroy(workerId.value)
    .then(() => {
      showSnackbar("アカウントの削除に成功しました", "primary");
      router.push("/worker");
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
  { title: "ワーカー", to: "/worker" },
  { title: worker.value?.fullName ?? "", to: `/worker/${workerId.value}` },
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
          <v-dialog v-model="isDialog" max-width="400">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                v-bind="activatorProps"
                class=""
                size="48"
                variant="text"
                prepend-icon="mdi-trash-can"
                color="error"
                min-width="100"
              >
                削除
              </v-btn>
            </template>

            <v-card>
              <v-card-text>
                {{ worker?.fullName }}を削除しますか？
              </v-card-text>
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
        <v-card-title class="bg-gray-100">
          <div class="flex flex-col items-center justify-center mt-3">
            <v-avatar size="120">
              <v-img
                v-if="worker?.image"
                :src="worker.image"
                :alt="worker.nickname ?? 'ニックネーム'"
              />
              <v-icon v-else size="130" color="primary"
                >mdi-account-circle</v-icon
              >
            </v-avatar>
            <p class="text-center text-lg mt-2">{{ worker?.nickname }}</p>
          </div>
        </v-card-title>
        <v-card-item>
          <v-list lines="one">
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">氏名</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ worker?.lastName }} {{ worker?.firstName }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">フリガナ</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ worker?.lastNameKana }} {{ worker?.firstNameKana }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">メールアドレス</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ worker?.email }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">電話番号</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ worker?.tel }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">生年月日</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ worker?.dateOfBirth }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">性別</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ worker?.genderText }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">郵便番号</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ worker?.postalCode }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">住所</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ worker?.address }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">ジャンル</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                <div class="flex flex-wrap ga-2 mt-1">
                  <v-chip
                    v-for="genre in worker?.genres"
                    :key="genre.id"
                    size="small"
                    :color="genre.color"
                  >
                    {{ genre.name }}
                  </v-chip>
                </div>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-item>
      </v-card>
    </v-col>

    <v-col cols="12" sm="10" md="9" lg="8" xl="7">
      <v-card>
        <v-card-title>
          <div class="flex items-center justify-between">
            <v-label>コース</v-label>
            <v-btn
              class=""
              size="48"
              variant="text"
              color="success"
              min-width="100"
              @click="router.push(`/course/create?workerId=${workerId}`)"
            >
              <v-icon size="20">mdi-plus</v-icon>
              <span class="text-base">追加</span>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <WorkerCourseTable></WorkerCourseTable>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="10" md="9" lg="8" xl="7">
      <v-card>
        <v-card-title>
          <div class="flex items-center justify-between">
            <v-label>レッスン</v-label>
            <v-btn
              class=""
              size="48"
              variant="text"
              color="success"
              min-width="100"
              @click="router.push(`/lesson/create?workerId=${workerId}`)"
            >
              <v-icon size="20">mdi-plus</v-icon>
              <span class="text-base">追加</span>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <WorkerLessonTable></WorkerLessonTable>
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
        <v-card-text> {{ worker?.fullName }}を削除しますか？ </v-card-text>
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
