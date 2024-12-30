<script setup lang="ts">
import dayjs from "dayjs";
import type { ChatMessage } from "@/interface/entities/ChatMessage";
import type { ErrorResponse } from "@/type/api/ErrorResponse";

interface Emits {
  (event: "changeTextareaHeight", height: number): void;
}
const emits = defineEmits<Emits>();

const route = useRoute();
const { auth } = useAuth();
const { chatMessages, create } = useChatMessage();
const { showSnackbar } = useSnackbar();
const body = ref<string>("");
const file = ref<File | null>(null);

const chatId = computed((): string => {
  return String(route.params.id);
});

const isSendable = computed((): boolean => {
  return !!(body.value || file.value);
});

const onSubmitText = async () => {
  if (body.value) {
    chatMessages.value.push({
      ...setNewMessage(),
      body: body.value,
    } as ChatMessage);

    const params = {
      chat_id: chatId.value,
      body: body.value,
    };

    await create(params).then(() => {
      body.value = "";
      emits("changeTextareaHeight", 40)
    })
    .catch((error: ErrorResponse) => {
      showSnackbar(error.data.message, "error");
    });
  }
};

const onSubmitFile = async () => {
  if (file.value) {
    chatMessages.value.push({
      ...setNewMessage(),
      image: URL.createObjectURL(file.value),
    } as ChatMessage);

    const formData = new FormData();
    formData.append("chat_id", chatId.value);
    formData.append("file", file.value);

    await create(formData).then(() => {
      file.value = null;
    })
    .catch((error: ErrorResponse) => {
      showSnackbar(error.data.message, "error");
    });
  }
};

const setNewMessage = (): Partial<ChatMessage> => {
  return {
    id: crypto.randomUUID(),
    chatId: chatId.value,
    workerId: auth.value?.id ?? null,
    userId: null,
    body: null,
    image: null,
    worker: auth.value,
    user: null,
    createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  }
}

const onInputText = (event: Event) => {
  emits("changeTextareaHeight", Math.max((event.target as HTMLTextAreaElement).scrollHeight, 40));
};

</script>

<template>
  <v-file-input
    v-if="file"
    v-model="file"
    variant="outlined"
    density="compact"
    hide-details="auto"
    bg-color="white"
    prepend-icon="mdi-image"
    class="mt-3"
  >
    <template v-slot:append>
      <v-btn
        icon
        density="compact"
        color="primary"
        variant="text"
        :disabled="!isSendable"
        @click="onSubmitFile"
      >
        <v-icon size="small">mdi-send</v-icon>
      </v-btn>
    </template>
  </v-file-input>

  <v-textarea
    v-else
    v-model="body"
    variant="outlined"
    density="compact"
    hide-details="auto"
    bg-color="white"
    rows="1"
    max-rows="7"
    auto-grow
    maxlength="1000"
    class="mt-2"
    @input="onInputText"
  >
    <template v-slot:prepend>
      <v-file-input
        v-model="file"
        hide-input
        prepend-icon="mdi-image"
      ></v-file-input>
    </template>
    <template v-slot:append>
      <v-btn
        icon
        density="compact"
        color="primary"
        variant="text"
        :disabled="!isSendable"
        @click="onSubmitText"
      >
        <v-icon size="small">mdi-send</v-icon>
      </v-btn>
    </template>
  </v-textarea>
</template>