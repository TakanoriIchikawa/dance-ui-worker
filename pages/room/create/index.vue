<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import type { ErrorResponse } from "@/type/api/ErrorResponse";

const router = useRouter();
const { room, create } = useRoom();
const { errors } = useErrors();
const { showSnackbar } = useSnackbar();
const { breadcrumbs } = useBreadcrumbs();
const isLoading = ref<boolean>(false);

onBeforeMount(() => {
  room.value = null;
  errors.value = {};
});

const onCreate = async (params: any) => {
  isLoading.value = true;
  await create(params)
    .then(() => {
      showSnackbar("ルームの登録に成功しました", "success");
      router.push("/room");
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
  { title: "新規登録", to: "/room/create" },
];
</script>

<template>
  <v-row dense justify="center">
    <v-col cols="12" sm="10" md="10" lg="8" xl="6">
      <v-card>
        <v-card-text>
          <RoomForm :isLoading="isLoading" @save="onCreate"></RoomForm>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
