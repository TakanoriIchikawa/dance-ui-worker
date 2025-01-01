<script setup lang="ts">
import dayjs from "dayjs";
import type { ChatMessage } from "@/interface/entities/ChatMessage";
import type { ErrorResponse } from "@/types/api/ErrorResponse";

interface Props {
  chatMessage: ChatMessage;
  isSameSender: boolean;
  isSameMinute: boolean;
}
const props = withDefaults(defineProps<Props>(), {});
const router = useRouter();
const { auth } = useAuth();
const { chat } = useChat();
const { chatMessages, destroy } = useChatMessage();
const { create } = useChatWorkerUnreadMessage();
const { showSnackbar } = useSnackbar();

const isMyMessage = computed((): boolean => {
  return auth.value?.id === props.chatMessage.workerId
})

const onDeleteMessage = async () => {
  await destroy(props.chatMessage.id).then(() => {
    chatMessages.value = chatMessages.value.filter((chatMessage: ChatMessage) => props.chatMessage.id !== chatMessage.id)
    showSnackbar("メッセージを削除しました", "primary")
  }).catch((errorResponse: ErrorResponse) => {
    showSnackbar("メッセージの削除に失敗しました", "error")
  })
}

const onUnreadMessage = async () => {
  const params = {
    chat_id: chat.value?.id,
    chat_message_id: props.chatMessage.id,
  }
  await create(params).then(() => {
    router.push({ name: 'chat',  query: { is_group: String(chat.value?.isGroup) }})
  }).catch((errorResponse: ErrorResponse) => {
    showSnackbar("未読処理に失敗しました", "error")
  })
}

</script>

<template>
  <div>
    <div class="mb-3">
      <div class="flex items-start justify-end" :class="isMyMessage ? 'flex-row' : 'flex-row-reverse'">
        <div class="flex items-end justify-end" :class="isMyMessage ? 'flex-row' : 'flex-row-reverse'">
          <span class="text-xs">{{ dayjs(chatMessage.createdAt).format('HH:mm') }}</span>
          <v-menu :location="isMyMessage ? 'start' : 'end'">
            <template v-slot:activator="{ props }">
              <div class="mx-1.5 cursor-pointer" v-bind="props">
                <v-card v-if="chatMessage.body" elevation="5">
                  <v-card-text>{{ chatMessage.body }}</v-card-text>
                </v-card>
                <v-img
                  v-if="chatMessage.image"
                  :src="chatMessage.image"
                  :min-width="150"
                  :max-width="300"
                  rounded="lg"
                >
                </v-img>
              </div>
            </template>
            <v-list v-if="isMyMessage" class="mr-1" min-width="150" density="compact">
              <v-list-item @click="onDeleteMessage">
                <template v-slot:prepend>
                  <v-icon icon="mdi-trash-can"></v-icon>
                </template>
                <v-list-item-title>
                  削除
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <v-list v-else class="ml-1" min-width="150" density="compact">
              <v-list-item @click="onUnreadMessage">
                <template v-slot:prepend>
                  <v-icon icon="mdi-message-arrow-left-outline"></v-icon>
                </template>
                <v-list-item-title>
                  未読
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div v-if="isSameSender && isSameMinute" class="min-w-7"></div>
        <div v-else class="">
          <v-avatar size="28">
            <v-img
              v-if="chatMessage.worker && chatMessage.worker.image"
              :src="chatMessage.worker.image"
              :alt="chatMessage.worker.fullName ?? '氏名'"
            />
            <v-img
              v-else-if="chatMessage.user && chatMessage.user.image"
              :src="chatMessage.user.image"
              :alt="chatMessage.user.fullName ?? '氏名'"
            />
            <v-icon v-else size="28" color="primary">mdi-account-circle</v-icon>
          </v-avatar>
        </div>
      </div>
    </div>
  </div>  
</template>

<style scoped>
:deep(.v-card-text) {
  padding: 4px !important;
}
</style>
