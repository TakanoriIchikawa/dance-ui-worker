<script setup lang="ts">
import dayjs from "dayjs";
import type { ChatMessage } from "@/interface/entities/ChatMessage";

interface Props {
  chatMessage: ChatMessage;
  isSameSender: boolean;
  isSameMinute: boolean;
}
const props = withDefaults(defineProps<Props>(), {});
const { auth } = useAuth();
</script>

<template>
  <div>
    <div class="mb-3">
      <div v-if="auth.id === chatMessage.workerId" class="flex items-start justify-end">
        <div class="flex items-end justify-end">
          <span class="text-xs mr-1">{{ dayjs(chatMessage.createdAt).format('HH:mm') }}</span>
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
        <div v-if="isSameSender && isSameMinute" class="min-w-8 ml-0.5"></div>
        <div v-else class="ml-1.5">
          <v-avatar size="28">
            <v-icon size="28" color="primary">mdi-account-circle</v-icon>
          </v-avatar>
        </div>
      </div>
      <div v-else class="flex items-start justify-start">
        <div v-if="isSameSender && isSameMinute" class="min-w-8 mr-0.5"></div>
        <div v-else class="mr-1.5">
          <v-avatar size="28">
            <v-icon size="28" color="primary">mdi-account-circle</v-icon>
          </v-avatar>
        </div>
        <div class="flex items-end justify-start">
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
          <span class="text-xs ml-1">{{ dayjs(chatMessage.createdAt).format('HH:mm') }}</span>
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
