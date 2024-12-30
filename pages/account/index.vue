<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import { useDisplay } from "vuetify";
import type { ErrorResponse } from "@/type/api/ErrorResponse";

const route = useRoute();
const router = useRouter();
const { auth } = useAuth();
const { breadcrumbs } = useBreadcrumbs();
const { smAndDown, mdAndUp } = useDisplay();

if (!auth.value) {
  throw createError({ statusCode: 401 });
}

breadcrumbs.value = [
  { title: "ホーム", to: "/" },
  { title: "アカウント", to: "/account" },
];
</script>

<template>
  <v-row justify="center" justify-xl="start">
    <v-col cols="12" sm="10" md="8" lg="7" xl="6">
      <v-card class="relative">
        <div v-if="mdAndUp" class="absolute top-0 right-0 flex justify-end">
          <v-btn
            class=""
            size="48"
            variant="text"
            color="blue"
            min-width="100"
            @click="router.push(`/account/edit`)"
          >
            <v-icon size="20">mdi-pencil</v-icon>
            <span class="text-base">編集</span>
          </v-btn>
        </div>
        <v-card-title class="bg-gray-100">
          <div class="flex flex-col items-center justify-center mt-3">
            <v-avatar size="120">
              <v-img
                v-if="auth?.image"
                :src="auth.image"
                :alt="auth.nickname ?? 'ニックネーム'"
              />
              <v-icon v-else size="130" color="primary"
                >mdi-account-circle</v-icon
              >
            </v-avatar>
            <p class="text-center text-lg mt-2">{{ auth?.nickname }}</p>
          </div>
        </v-card-title>
        <v-card-item>
          <v-list lines="one">
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">氏名</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ auth?.lastName }} {{ auth?.firstName }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">フリガナ</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ auth?.lastNameKana }} {{ auth?.firstNameKana }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">メールアドレス</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ auth?.email }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">電話番号</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ auth?.tel }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">生年月日</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ auth?.dateOfBirth }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">性別</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ auth?.genderText }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">郵便番号</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ auth?.postalCode }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">住所</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ auth?.address }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">ジャンル</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                <div class="flex flex-wrap ga-2 mt-1">
                  <v-chip
                    v-for="genre in auth?.genres"
                    :key="genre.id"
                    size="small"
                    :color="genre.color"
                  >
                    {{ genre.name }}
                  </v-chip>
                </div>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-item>
      </v-card>
    </v-col>
    <v-btn
      v-if="smAndDown"
      position="fixed"
      location="bottom right"
      icon="mdi-pencil"
      class="mr-5 mb-15"
      size="48"
      color="primary"
      elevation="8"
      @click="router.push(`/account/edit`)"
    />
  </v-row>
</template>

<style scoped>
.v-list-item {
  padding-inline-start: 0 !important;
}
</style>
