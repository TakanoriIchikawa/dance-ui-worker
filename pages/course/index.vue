<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import { useDisplay } from "vuetify";
import type { Course } from "@/interface/entities/Course";
import type { ErrorResponse } from "@/type/api/ErrorResponse";

const route = useRoute();
const router = useRouter();
const { courses, fetch } = useCourse();
const { paginate } = usePaginate();
const { breadcrumbs } = useBreadcrumbs();
const { smAndDown, mdAndUp } = useDisplay();
const { showSnackbar } = useSnackbar();

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

await useAsyncData("fetchCourseData", async () => {
  await fetch({});
  return { courses: courses.value };
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

const onClickRow = async (event: MouseEvent, { item }: { item: Course }) => {
  router.push("/course/" + item.id);
};

const onPaginate = async (pageValue: number) => {
  page.value = pageValue;
  await onFetch();
};

const onSort = async (event: { key: string; order: "desc" | "asc" }[]) => {
  sortKey.value = event[0]
    ? event[0].key.replace(/([A-Z])/g, "_$1").toLowerCase()
    : "";
  sortOrder.value = event[0] ? event[0].order : "";
  await onFetch();
};

const headers = computed(() => {
  if (smAndDown.value) {
    return defaultHeaders.value.filter((item) => item.isShowMobile);
  }
  return defaultHeaders.value;
});

const defaultHeaders = ref([
  {
    title: "コース名",
    align: "start" as const,
    sortable: true,
    key: "name",
    nowrap: true,
    isShowMobile: true,
  },
  {
    key: "studios",
    title: "スタジオ",
    align: "start" as const,
    sortable: false,
    nowrap: true,
    isShowMobile: true,
  },
  {
    key: "genres",
    title: "ジャンル",
    align: "start" as const,
    sortable: false,
    nowrap: true,
    isShowMobile: true,
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
  { title: "コース", to: "/course" },
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
          placeholder="コース名"
          hide-details="auto"
          bg-color="white"
          class=""
        ></v-text-field>
      </v-col>
      <v-col v-if="mdAndUp" offset-md="4" offset-lg="5" offset-xl="6" cols="2">
        <div class="flex justify-end">
          <v-btn
            class=""
            size="48"
            variant="text"
            color="success"
            min-width="120"
            @click="router.push(`/course/create`)"
          >
            <v-icon size="20">mdi-plus</v-icon>
            <span>新規登録</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-data-table-server
      :headers="headers"
      :items="courses"
      :items-length="courses.length"
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
      <template #[`item.studios`]="{ item }">
        <span v-for="studio in item.studios" :key="studio.id">
          {{ studio.name }}
        </span>
      </template>
      <template #[`item.genres`]="{ item }">
        <div class="flex ga-1">
          <v-chip
            v-for="genre in item.genres"
            :key="genre.id"
            size="x-small"
            :color="genre.color"
          >
            {{ genre.name }}
          </v-chip>
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
      @click="router.push('/course/create')"
    />
  </div>
</template>
