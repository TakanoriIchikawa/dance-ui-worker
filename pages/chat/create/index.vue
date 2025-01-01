<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import type { ErrorResponse } from "@/types/api/ErrorResponse";

const router = useRouter();
const { chat, create } = useChat();
const { errors } = useErrors();
const { showSnackbar } = useSnackbar();
const { breadcrumbs } = useBreadcrumbs();
const isLoading = ref<boolean>(false);

onBeforeMount(() => {
  chat.value = null;
  errors.value = {};
});

const onCreate = async (params: any) => {
  isLoading.value = true;
  await create(params)
    .then(() => {
      showSnackbar("チャットグループを作成しました", "primary");
      router.push("/chat");
    })
    .catch((errorResponse: ErrorResponse) => {
      showSnackbar(errorResponse.data.message, "error");
      if (errorResponse.status === 422) {
        const errorMessages = errorResponse.data.errors;
        errors.value.name = errorMessages.name?.[0] ?? "";
        errors.value.workerIds = errorMessages.worker_ids?.[0] ?? "";
        errors.value.userIds = errorMessages.user_ids?.[0] ?? "";
        errors.value.workerId = errorMessages.worker_id?.[0] ?? "";
        errors.value.userId = errorMessages.user_id?.[0] ?? "";
      }
    })
    .finally(() => {
      isLoading.value = false;
    });
};

breadcrumbs.value = [
  { title: "ホーム", to: "/" },
  { title: "チャット", to: "/chat" },
  { title: "新規作成", to: "/chat/create" },
];
</script>

<template>
  <v-row dense justify="center">
    <v-col cols="12" sm="10" md="9" lg="8" xl="7">
      <v-card>
        <v-card-text>
          <ChatForm :isLoading="isLoading" @save="onCreate"></ChatForm>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
