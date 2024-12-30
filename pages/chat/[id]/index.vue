<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });
import dayjs from "dayjs";
import type { VInfiniteScroll } from "vuetify/components";

const route = useRoute();
const { chat, find } = useChat();
const { chatMessages, fetch } = useChatMessage();
const { paginate } = usePaginate();
const { breadcrumbs } = useBreadcrumbs();
const { height } = useDisplay();

const chatId = computed((): string => {
  return String(route.params.id);
});

const sortedChatMessages = computed(() => {
  return [...chatMessages.value].sort((a, b) =>
    dayjs(a.createdAt).diff(dayjs(b.createdAt))
  );
});

await useAsyncData("findChatData", async () => {
  await find(chatId.value);
  return { chat: chat.value };
});

await useAsyncData("fetchChatMessageData", async () => {
  await fetch({ chat_id: chatId.value });
  return { chatMessages: chatMessages.value };
});

const onLoad = (options: any) => {
  setTimeout(async () => {
    if (paginate.value.currentPage == paginate.value.lastPage) {
      options.done("empty");
    } else {
      const nextPage = (paginate.value?.currentPage ?? 0) + 1;
      await fetch({ chat_id: chatId.value, page: nextPage }, true).then(() => {
        options.done("ok");
      });
    }    
  }, 1000);
};

const isSameSender = (index: number): boolean => {
  if (index === 0) {
    return false;
  }
  if (
    sortedChatMessages.value[index].workerId !== null &&
    sortedChatMessages.value[index - 1].workerId !== null
  ) {
    return (
      sortedChatMessages.value[index].workerId ===
      sortedChatMessages.value[index - 1].workerId
    );
  }
  if (
    sortedChatMessages.value[index].userId !== null &&
    sortedChatMessages.value[index - 1].userId !== null
  ) {
    return (
      sortedChatMessages.value[index].userId ===
      sortedChatMessages.value[index - 1].userId
    );
  }
  return false;
};

const isSameDay = (index: number): boolean => {
  if (index === 0) {
    return false;
  }
  return dayjs(sortedChatMessages.value[index].createdAt).isSame(
    dayjs(sortedChatMessages.value[index - 1].createdAt),
    "day"
  );
};

const isSameMinute = (index: number): boolean => {
  if (index === 0) {
    return false;
  }
  return dayjs(sortedChatMessages.value[index].createdAt).isSame(
    dayjs(sortedChatMessages.value[index - 1].createdAt),
    "minute"
  );
};

const textareaHeight = ref(40);
const infiniteScrollHeight = computed(() => {
  return height.value - (Math.min(textareaHeight.value, 184) + 200)
});

breadcrumbs.value = [
  { title: "ホーム", to: "/" },
  { title: "チャット", to: "/chat" },
  { title: chat.value?.name ?? "", to: `/chat/${chatId.value}` },
];
</script>

<template>
  <v-row justify="center">
    <v-col cols="12" sm="10" md="8" lg="7" xl="6" class="pb-0">
      <v-infinite-scroll
        :height="infiniteScrollHeight"
        side="start"
        empty-text=""
        @load="onLoad"
      >
        <div
          v-for="(chatMessage, chatMessageIndex) in sortedChatMessages"
          :key="chatMessage.id"
        >
          <div
            v-if="!isSameDay(chatMessageIndex)"
            class="flex items-center justify-center my-1.5"
          >
            <v-label>
              <span class="text-sm">{{
                dayjs(chatMessage.createdAt).format("YYYY年MM月DD日")
              }}</span>
            </v-label>
          </div>

          <ChatMessage
            :chatMessage="chatMessage"
            :isSameSender="isSameSender(chatMessageIndex)"
            :isSameMinute="isSameMinute(chatMessageIndex)"
          ></ChatMessage>
        </div>
      </v-infinite-scroll>

      <ChatTextarea
        @changeTextareaHeight="(height: number) => textareaHeight = height"
      ></ChatTextarea>
    </v-col>
  </v-row>
</template>

<style scoped>
:deep(.v-input__prepend) {
  margin-inline-end: 4px !important;
}

:deep(.v-input__append) {
  margin-inline-start: 4px !important;
}
</style>
