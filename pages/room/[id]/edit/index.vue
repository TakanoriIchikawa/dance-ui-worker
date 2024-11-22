<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import type { ErrorResponse } from "@/type/api/ErrorResponse";

const route = useRoute();
const { room, find, update } = useRoom();
const { errors } = useErrors();
const { showSnackbar } = useSnackbar();
const { breadcrumbs } = useBreadcrumbs();
const isLoading = ref<boolean>(false);

const roomId = computed((): string => {
  return String(route.params.id);
});

await useAsyncData("findRoomData", async () => {
  await find(roomId.value);
  return { room: room.value };
});

onBeforeMount(() => {
  errors.value = {};
});

if (!room.value) {
  throw createError({ statusCode: 404 });
}

const onUpdate = async (params: any) => {
  isLoading.value = true;
  await update(roomId.value, params)
    .then(() => {
      showSnackbar("ルームの更新に成功しました", "success");
    })
    .catch((errorResponse: ErrorResponse) => {
      showSnackbar(errorResponse.data.message, "error");
      if (errorResponse.status === 422) {
        const errorMessages = errorResponse.data.errors;
        errors.value.name = errorMessages.name?.[0] ?? "";
        errors.value.description = errorMessages.description?.[0] ?? "";
        errors.value.capacity = errorMessages.capacity?.[0] ?? "";
        errors.value.studioId = errorMessages.studio_id?.[0] ?? "";
      }
    })
    .finally(() => {
      isLoading.value = false;
    });
};

breadcrumbs.value = [
  { title: "ホーム", to: "/" },
  { title: "ルーム", to: "/room" },
  { title: room.value?.name ?? "", to: `/room/${roomId.value}` },
  { title: "編集", to: `/room/${roomId.value}/edit` },
];
</script>

<template>
  <v-row dense justify="center">
    <v-col cols="12" sm="10" md="10" lg="8" xl="6">
      <v-card>
        <v-card-text>
          <RoomForm :isLoading="isLoading" @save="onUpdate"></RoomForm>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
