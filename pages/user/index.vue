<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import { useDisplay } from "vuetify";
import type { User } from "@/interface/entities/User";
import type { ErrorResponse } from "@/types/api/ErrorResponse";

const route = useRoute();
const router = useRouter();
const { auth } = useAuth();
const { users, fetch } = useUser();
const { paginate } = usePaginate();
const { breadcrumbs } = useBreadcrumbs();
const { smAndDown, mdAndUp } = useDisplay();
const { showSnackbar } = useSnackbar();

const applicationUrl = ref<string>(
  `http://dance.localhost/organization/${auth.value?.organizationId}/application`
);
const keyword = ref<string>(
  route.query.keyword ? String(route.query.keyword) : ""
);
const page = ref<number>(route.query.page ? Number(route.query.page) : 1);
const sortKey = ref<string>(
  route.query.sortKey ? String(route.query.sortKey) : "created_at"
);
const sortOrder = ref<string>(
  route.query.sortOrder ? String(route.query.sortOrder) : "desc"
);
const isLoading = ref<boolean>(false);
const isDialog = ref<boolean>(false);

await useAsyncData("fetchUserData", async () => {
  await fetch(route.query);
  return { users: users.value };
});

watch(keyword, async (newValue) => {
  await onFetch();
});

const onFetch = async () => {
  isLoading.value = true;
  const params = {
    keyword: keyword.value,
    page: page.value,
    sort_key: sortKey.value,
    sort_order: sortOrder.value,
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

const onClickRow = async (event: MouseEvent, { item }: { item: User }) => {
  router.push("/user/" + item.id);
};

const onPaginate = async (pageValue: number) => {
  page.value = pageValue;
  await onFetch();
};

const onSort = async (event: { key: string; order: "desc" | "asc" }[]) => {
  sortKey.value = event[0]
    ? event[0].key.replace(/([A-Z])/g, "_$1").toLowerCase()
    : "";
  if (sortKey.value === "full_name") {
    sortKey.value = "last_name_kana";
  }
  sortOrder.value = event[0] ? event[0].order : "";
  await onFetch();
};

const onCopy = async () => {
  await navigator.clipboard.writeText(applicationUrl.value);
  showSnackbar("クリップボードにコピーしました", "primary");
};

const headers = computed(() => {
  if (smAndDown.value) {
    return defaultHeaders.value.filter((item) => item.isShowMobile);
  }
  return defaultHeaders.value;
});

const defaultHeaders = ref([
  {
    title: "",
    align: "start" as const,
    sortable: true,
    key: "image",
    nowrap: true,
    isShowMobile: false,
  },
  {
    title: "氏名",
    align: "start" as const,
    sortable: true,
    key: "fullName",
    nowrap: true,
    isShowMobile: true,
  },
  {
    title: "メールアドレス",
    align: "start" as const,
    sortable: true,
    key: "email",
    nowrap: true,
    isShowMobile: true,
  },
  {
    title: "電話番号",
    align: "start" as const,
    sortable: true,
    key: "tel",
    nowrap: true,
    isShowMobile: true,
  },
  {
    title: "生年月日",
    align: "start" as const,
    sortable: true,
    key: "dateOfBirth",
    nowrap: true,
    isShowMobile: false,
  },
  {
    title: "性別",
    align: "start" as const,
    sortable: true,
    key: "genderText",
    nowrap: true,
    isShowMobile: false,
  },
  {
    title: "住所",
    align: "start" as const,
    sortable: false,
    key: "address",
    nowrap: true,
    isShowMobile: false,
    maxWidth: "400px",
  },
  {
    title: "作成日時",
    align: "start" as const,
    sortable: true,
    key: "createdAt",
    nowrap: true,
    isShowMobile: false,
  },
]);

breadcrumbs.value = [
  { title: "ホーム", to: "/" },
  { title: "契約者", to: "/user" },
];
</script>

<template>
  <div>
    <v-row dense align="end">
      <v-col cols="12" md="6" lg="5" xl="4">
        <v-text-field
          v-model="keyword"
          label="キーワード"
          type="text"
          variant="solo"
          append-inner-icon="mdi-magnify"
          placeholder="スタジオ名、電話番号、メールアドレス"
          hide-details="auto"
          bg-color="white"
          class=""
        ></v-text-field>
      </v-col>
      <v-col v-if="mdAndUp" offset-md="4" offset-lg="5" offset-xl="6" cols="2">
        <v-dialog v-model="isDialog" max-width="600">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              class=""
              size="48"
              variant="text"
              color="primary"
              min-width="140"
            >
              <v-icon size="20">mdi-link</v-icon>
              <span class="text-base">申込用リンク</span>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>申込用リンク</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="applicationUrl"
                label="以下のリンクから申込手続き"
                placeholder=""
                type="text"
                variant="underlined"
                density="compact"
                hide-details="auto"
                readonly
                bg-color="white"
                class="mb-3"
                @click="onCopy"
              >
                <template v-slot:append-inner>
                  <v-btn
                    icon
                    variant="text"
                    density="comfortable"
                    @click="onCopy"
                  >
                    <v-icon size="small">mdi-content-copy</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
              <v-img
                src="/qr.png"
                alt="申込用リンク"
                :width="240"
                class="mx-auto"
              />
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text="閉じる" width="90" @click="isDialog = false"></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <v-data-table-server
      :headers="headers"
      :items="users"
      :items-length="users.length"
      :loading="isLoading"
      class="mt-2.5"
      mobileBreakpoint="sm"
      return-object
      hover
      @click:row="onClickRow"
      @update:sortBy="onSort"
    >
      <template #no-data>データが存在しません</template>
      <template #bottom></template>
      <template #[`item.image`]="{ item }">
        <v-avatar size="32">
          <v-img
            v-if="item.image"
            :src="item.image"
            :alt="item.nickname ?? 'ニックネーム'"
          />
          <v-icon v-else size="36" color="primary">mdi-account-circle</v-icon>
        </v-avatar>
      </template>
      <template #[`item.fullName`]="{ item }">
        {{ item.fullName }}{{ item.nickname ? `（${item.nickname}）` : null }}
      </template>
      <template #[`item.address`]="{ item }">
        <div class="text-truncate">
          {{ item.address }}
        </div>
      </template>
    </v-data-table-server>

    <div class="max-w-64 sm:max-w-sm md:max-w-xl mx-auto m-3">
      <v-pagination
        v-model="page"
        :length="paginate.lastPage"
        @update:model-value="onPaginate"
      />
    </div>

    <v-btn
      v-if="smAndDown"
      position="fixed"
      location="bottom right"
      icon="mdi-plus"
      class="mr-5 mb-15"
      size="48"
      color="success"
      elevation="8"
      @click="router.push('/user/invitation')"
    />
  </div>
</template>
