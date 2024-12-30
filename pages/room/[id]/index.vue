<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import { useDisplay } from "vuetify";
import type { Dayjs } from "dayjs";
import type { EventInput } from "@fullcalendar/core";
import type { ErrorResponse } from "@/type/api/ErrorResponse";

const route = useRoute();
const router = useRouter();
const { room, find, destroy } = useRoom();
const { showSnackbar } = useSnackbar();
const { breadcrumbs } = useBreadcrumbs();
const { smAndDown, mdAndUp } = useDisplay();
const isLoading = ref<boolean>(false);
const isDialog = ref<boolean>(false);

const roomId = computed((): string => {
  return String(route.params.id);
});

await useAsyncData("findRoomData", async () => {
  await find(roomId.value);
  return { room: room.value };
});

if (!room.value) {
  throw createError({ statusCode: 404 });
}

const onDestroy = async () => {
  isLoading.value = true;
  await destroy(roomId.value)
    .then(() => {
      showSnackbar("ルームの削除に成功しました", "success");
      router.push("/room");
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
  { title: "ルーム", to: "/room" },
  { title: room.value?.name ?? "", to: `/room/${roomId.value}` },
];
</script>

<template>
  <v-row justify="center" justify-xl="start">
    <v-col cols="12" sm="10" md="8" lg="7" xl="6">
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
            @click="router.push(`/room/${roomId}/edit`)"
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
              <v-card-text> {{ room?.name }}を削除しますか？ </v-card-text>
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
        <v-img v-if="room?.image" max-height="250" :src="room.image" cover>
        </v-img>
        <v-card-title>
          {{ room?.name }}
        </v-card-title>
        <v-card-subtitle>
          <p class="text-base whitespace-pre-wrap">{{ room?.description }}</p>
        </v-card-subtitle>
        <v-card-text>
          <v-list lines="one">
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">スタジオ</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                <v-btn
                  variant="text"
                  density="compact"
                  size="large"
                  slim
                  :to="`/studio/${room?.studioId}`"
                >
                  {{ room?.studio?.name }}
                </v-btn>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">収容人数</span>
              </v-list-item-subtitle>
              <v-list-item-title> {{ room?.capacity }}名 </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">設備・備品</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                <div class="flex flex-wrap ga-2 mt-1">
                  <v-chip
                    v-for="factory in room?.factories"
                    :key="factory.id"
                    size="small"
                    :color="factory.color"
                  >
                    {{ factory.name }}
                  </v-chip>
                </div>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="10" md="8" lg="7" xl="6">
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
      @click="router.push(`/room/${roomId}/edit`)"
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
        <v-card-text> {{ room?.name }}を削除しますか？ </v-card-text>
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
