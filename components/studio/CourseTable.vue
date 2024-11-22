<script setup lang="ts">
import { useDisplay } from "vuetify";
import type { Course } from "@/interface/entities/Course";

const router = useRouter();
const { studio } = useStudio();
const { smAndDown } = useDisplay();

const courseHeaders = computed(() => {
  if (smAndDown.value) {
    return courseDefaultHeaders.value.filter((item) => item.isShowMobile);
  }
  return courseDefaultHeaders.value;
});

const courseDefaultHeaders = ref([
  {
    key: "name",
    title: "コース名",
    align: "start" as const,
    sortable: true,
    nowrap: true,
    isShowMobile: true,
  },
  {
    key: "genres",
    title: "ジャンル",
    align: "start" as const,
    sortable: false,
    nowrap: true,
    isShowMobile: true,
  },
]);

const onClickRow = async (event: MouseEvent, { item }: { item: Course }) => {
  router.push("/course/" + item.id);
};
</script>

<template>
  <v-data-table-server
    :headers="courseHeaders"
    :items="studio?.courses"
    :items-length="studio?.courses?.length ?? 0"
    mobileBreakpoint="sm"
    return-object
    hover
    @click:row="onClickRow"
  >
    <template #no-data>データが存在しません</template>
    <template #bottom></template>
    <template #[`item.genres`]="{ item }">
      <div class="flex ga-1">
        <v-chip
          v-for="genre in item.genres"
          :key="genre.id"
          size="x-small"
          :color="genre.color"
        >
          {{ genre.name }}
        </v-chip>
      </div>
    </template>
  </v-data-table-server>
</template>
