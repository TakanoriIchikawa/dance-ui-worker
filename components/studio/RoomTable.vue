<script setup lang="ts">
import { useDisplay } from "vuetify";
import type { Room } from "@/interface/entities/Room";

const router = useRouter();
const { studio } = useStudio();
const { smAndDown } = useDisplay();

const roomHeaders = computed(() => {
  if (smAndDown.value) {
    return roomDefaultHeaders.value.filter((item) => item.isShowMobile);
  }
  return roomDefaultHeaders.value;
});

const roomDefaultHeaders = ref([
  {
    key: "name",
    title: "ルーム名",
    align: "start" as const,
    sortable: true,
    nowrap: true,
    isShowMobile: true,
  },
  {
    key: "capacity",
    title: "収容人数",
    align: "start" as const,
    sortable: false,
    nowrap: true,
    isShowMobile: true,
  },
]);

const onClickRow = async (event: MouseEvent, { item }: { item: Room }) => {
  router.push("/room/" + item.id);
};
</script>

<template>
  <v-data-table-server
    :headers="roomHeaders"
    :items="studio?.rooms"
    :items-length="studio?.rooms?.length ?? 0"
    mobileBreakpoint="sm"
    return-object
    hover
    @click:row="onClickRow"
  >
    <template #no-data>データが存在しません</template>
    <template #bottom></template>
  </v-data-table-server>
</template>
