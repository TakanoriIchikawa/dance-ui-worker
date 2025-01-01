<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import dayjs from "dayjs";
import { useDisplay } from "vuetify";
import type { Chat } from "@/interface/entities/Chat";
import type { ErrorResponse } from "@/types/api/ErrorResponse";

const route = useRoute();
const router = useRouter();
const { chats, fetch } = useChat();
const { paginate } = usePaginate();
const { breadcrumbs } = useBreadcrumbs();
const { smAndDown, mdAndUp } = useDisplay();
const { showSnackbar } = useSnackbar();
const tab = ref<number>(route.query.is_group === 'true' ? 1 : route.query.is_group === 'false' ? 2 : 1);
const keyword = ref<string>(route.query.keyword ? String(route.query.keyword) : "");
const page = ref<number>(route.query.page ? Number(route.query.page) : 1);
const isLoading = ref<boolean>(false);

await useAsyncData("fetchChatData", async () => {
  await fetch({ ...route.query, is_group: (route.query.hasOwnProperty("is_group") ? route.query.is_group : true) });
  return { chats: chats.value };
});

watch(keyword, async (newValue) => {
  await onFetch();
});

watch(tab, async (newValue) => {
  await onFetch();
});

const onFetch = async () => {
  isLoading.value = true;
  const params = {
    keyword: keyword.value,
    page: page.value,
    is_group: String(tab.value === 1),
  };
  await fetch(params)
    .then(() => {
      router.push({ query: params });
    })
    .catch((error: ErrorResponse) => {
      showSnackbar(error.data.message, "error");
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const onClickRow = async (event: MouseEvent, { item }: { item: Chat }) => {
  router.push("/chat/" + item.id);
};

const onPaginate = async (pageValue: number) => {
  page.value = pageValue;
  await onFetch();
};

const lastMessageAtText = (inputDate: string): string => {
  const today = dayjs()
  const lastMessageAt = dayjs(inputDate)
  const diffDays = today.diff(lastMessageAt, "day");
  switch (diffDays) {
    case 0: 
      return "今日"
    case 1: 
      return "昨日"
    case 2: 
      return "一昨日"
    case 3: 
      return "3日前"
    default:
      if (diffDays < 30) {
        return lastMessageAt.format("MM/DD")
      }
      if (diffDays < 365) {
        return `${today.diff(lastMessageAt, "month")}ヶ月前`;
      }
      return `${today.diff(lastMessageAt, "year")}年前`;
  }
}

const headers = ref([
  {
    title: "",
    align: "start" as const,
    sortable: false,
    key: "name",
    nowrap: true,
  },
  {
    title: "",
    align: "end" as const,
    sortable: false,
    key: "lastMessageAt",
    nowrap: true,
  },
]);

breadcrumbs.value = [
  { title: "ホーム", to: "/" },
  { title: "チャット", to: "/chat" },
];
</script>

<template>
  <div>
    <v-row dense justify="center">
      <v-col cols="12" sm="10" md="9" lg="8" xl="7">
        <v-card>
          <v-tabs v-model="tab" fixed-tabs bg-color="primary">
            <v-tab :value="1">チャットグループ</v-tab>
            <v-tab :value="2">ダイレクトメッセージ</v-tab>
          </v-tabs>
          <v-card-text>
            <v-text-field
              v-model="keyword"
              :label="tab === 1 ? 'グループ名' : '名前'"
              type="text"
              variant="underlined"
              append-inner-icon="mdi-magnify"
              placeholder="キーワード"
              hide-details="auto"
              bg-color="white"
              class="mb-3"
            >
              <template v-if="mdAndUp" v-slot:append>
                <v-btn
                  class=""
                  size="32"
                  variant="text"
                  color="primary"
                  min-width="100"
                  @click="router.push(`/chat/create`)"
                >
                  <v-icon size="16">mdi-plus</v-icon>
                  <span class="text-sm">新規作成</span>
                </v-btn>
              </template>
            </v-text-field>

            <v-tabs-window v-model="tab">
              <v-tabs-window-item :value="1">
                <v-data-table-server
                  :headers="headers"
                  :items="chats"
                  :items-length="chats.length"
                  :loading="isLoading"
                  class=""
                  mobileBreakpoint="sm"
                  return-object
                  hover
                  @click:row="onClickRow"
                >
                  <template #no-data>データが存在しません</template>
                  <template #headers></template>
                  <template #bottom></template>
                  <template #[`item.lastMessageAt`]="{ item }">
                    <v-badge
                      v-if="item.unreadCount"
                      color="success"
                      :content="item.unreadCount"
                      inline
                    ></v-badge>
                    {{ lastMessageAtText(item.lastMessageAt) }}
                  </template>
                </v-data-table-server>
              </v-tabs-window-item>
              <v-tabs-window-item :value="2">
                <v-data-table-server
                  :headers="headers"
                  :items="chats"
                  :items-length="chats.length"
                  :loading="isLoading"
                  class=""
                  mobileBreakpoint="sm"
                  return-object
                  hover
                  @click:row="onClickRow"
                >
                  <template #no-data>データが存在しません</template>
                  <template #headers></template>
                  <template #bottom></template>
                  <template #[`item.lastMessageAt`]="{ item }">
                    <v-badge
                      v-if="item.unreadCount"
                      color="success"
                      :content="item.unreadCount"
                      inline
                    ></v-badge>
                    {{ lastMessageAtText(item.lastMessageAt) }}
                  </template>
                </v-data-table-server>
              </v-tabs-window-item>
            </v-tabs-window>
            <div class="max-w-64 sm:max-w-sm md:max-w-xl mx-auto m-3">
              <v-pagination
                v-model="page"
                :length="paginate.lastPage"
                @update:model-value="onPaginate"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-btn
      v-if="smAndDown"
      position="fixed"
      location="bottom right"
      icon="mdi-plus"
      class="mr-5 mb-15"
      size="48"
      color="primary"
      elevation="8"
      @click="router.push('/chat/create')"
    />
  </div>
</template>
