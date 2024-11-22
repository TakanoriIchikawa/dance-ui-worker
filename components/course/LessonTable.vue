<script setup lang="ts">
import { useDisplay } from "vuetify";
import type { Lesson } from "@/interface/entities/Lesson";

const router = useRouter();
const { course } = useCourse();
const { smAndDown } = useDisplay();

const lessonHeaders = computed(() => {
  if (smAndDown.value) {
    return lessonDefaultHeaders.value.filter((item) => item.isShowMobile);
  }
  return lessonDefaultHeaders.value;
});

const lessonDefaultHeaders = ref([
  {
    key: "name",
    title: "レッスン名",
    align: "start" as const,
    sortable: true,
    nowrap: true,
    isShowMobile: true,
  },
  {
    key: "dayOfWeekText",
    title: "曜日",
    align: "start" as const,
    sortable: true,
    nowrap: true,
    isShowMobile: true,
  },
  {
    key: "time",
    title: "時間",
    align: "start" as const,
    sortable: false,
    nowrap: false,
    isShowMobile: false,
  },
]);

const onClickRow = async (event: MouseEvent, { item }: { item: Lesson }) => {
  router.push("/lesson/" + item.id);
};
</script>

<template>
  <v-data-table-server
    :headers="lessonHeaders"
    :items="course?.lessons"
    :items-length="course?.lessons?.length ?? 0"
    mobileBreakpoint="sm"
    return-object
    hover
    @click:row="onClickRow"
  >
    <template #no-data>データが存在しません</template>
    <template #bottom></template>
    <template #[`item.time`]="{ item }">
      {{ item.startTime }} 〜 {{ item.endTime }}
    </template>
  </v-data-table-server>
</template>
