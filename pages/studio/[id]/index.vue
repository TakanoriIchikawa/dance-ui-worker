<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

import { useDisplay } from "vuetify";
import type { ErrorResponse } from "@/type/api/ErrorResponse";

const route = useRoute();
const router = useRouter();
const { studio, find, destroy } = useStudio();
const { showSnackbar } = useSnackbar();
const { breadcrumbs } = useBreadcrumbs();
const { smAndDown, mdAndUp } = useDisplay();
const isLoading = ref<boolean>(false);
const isDialog = ref<boolean>(false);

const studioId = computed((): string => {
  return String(route.params.id);
});

await useAsyncData("findStudioData", async () => {
  await find(studioId.value);
  return { studio: studio.value };
});

if (!studio.value) {
  throw createError({ statusCode: 404 });
}

const onDestroy = async () => {
  isLoading.value = true;
  await destroy(studioId.value)
    .then(() => {
      showSnackbar("スタジオの削除に成功しました", "success");
      router.push("/studio");
    })
    .catch((errorResponse: ErrorResponse) => {
      showSnackbar(errorResponse.data.message, "error");
    })
    .finally(() => {
      isLoading.value = false;
    });
};

breadcrumbs.value = [
  { title: "ホーム", to: "/" },
  { title: "スタジオ", to: "/studio" },
  { title: studio.value?.name ?? "", to: `/studio/${studioId.value}` },
];
</script>

<template>
  <v-row justify="center" justify-xl="start">
    <v-col cols="12" sm="10" md="8" lg="7" xl="6">
      <v-card class="relative">
        <div
          v-if="mdAndUp"
          class="absolute top-0 right-0 z-10 flex justify-end"
        >
          <v-btn
            class=""
            size="48"
            variant="text"
            color="blue"
            min-width="100"
            @click="router.push(`/studio/${studioId}/edit`)"
          >
            <v-icon size="20">mdi-pencil</v-icon>
            <span class="text-base">編集</span>
          </v-btn>

          <v-dialog v-model="isDialog" max-width="400">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                v-bind="activatorProps"
                class=""
                size="48"
                variant="text"
                color="error"
                min-width="100"
              >
                <v-icon size="20">mdi-trash-can</v-icon>
                <span class="text-base">削除</span>
              </v-btn>
            </template>

            <v-card>
              <v-card-text> {{ studio?.name }}を削除しますか？ </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  text="削除"
                  color="error"
                  width="90"
                  @click="onDestroy"
                ></v-btn>
                <v-btn
                  text="キャンセル"
                  width="90"
                  @click="isDialog = false"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <v-img v-if="studio?.image" max-height="250" :src="studio.image" cover>
        </v-img>
        <v-card-title>
          {{ studio?.name }}
        </v-card-title>
        <v-card-subtitle>
          <p class="text-base whitespace-pre-wrap">{{ studio?.description }}</p>
        </v-card-subtitle>
        <v-card-text>
          <v-list lines="one">
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">電話番号</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ studio?.tel }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">メールアドレス</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ studio?.email }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">郵便番号</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ studio?.postalCode }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">住所</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ studio?.address }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">設備・備品</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                <div class="flex flex-wrap ga-2 mt-1">
                  <v-chip
                    v-for="factory in studio?.factories"
                    :key="factory.id"
                    size="small"
                    :color="factory.color"
                  >
                    {{ factory.name }}
                  </v-chip>
                </div>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">ジャンル</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                <div class="flex flex-wrap ga-2 mt-1">
                  <v-chip
                    v-for="genre in studio?.genres"
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
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="10" md="8" lg="7" xl="6">
      <v-card>
        <v-card-title>
          <div class="flex items-center justify-between">
            <v-label>ルーム</v-label>
            <v-btn
              class=""
              size="48"
              variant="text"
              color="success"
              min-width="100"
              @click="router.push(`/room/create?studioId=${studioId}`)"
            >
              <v-icon size="20">mdi-plus</v-icon>
              <span class="text-base">追加</span>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <StudioRoomTable></StudioRoomTable>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="10" md="8" lg="7" xl="6">
      <v-card>
        <v-card-title>
          <div class="flex items-center justify-between">
            <v-label>コース</v-label>
            <v-btn
              class=""
              size="48"
              variant="text"
              color="success"
              min-width="100"
              @click="router.push(`/course/create?studioId=${studioId}`)"
            >
              <v-icon size="20">mdi-plus</v-icon>
              <span class="text-base">追加</span>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <StudioCourseTable></StudioCourseTable>
        </v-card-text>
      </v-card>
    </v-col>

    <v-btn
      v-if="smAndDown"
      position="fixed"
      location="bottom right"
      icon="mdi-pencil"
      class="mr-20 mb-15"
      size="48"
      color="primary"
      elevation="8"
      @click="router.push(`/studio/${studioId}/edit`)"
    />

    <v-dialog v-model="isDialog" max-width="400">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          v-if="smAndDown"
          v-bind="activatorProps"
          position="fixed"
          location="bottom right"
          icon="mdi-trash-can"
          class="mr-5 mb-15"
          size="48"
          color="error"
          elevation="8"
        />
      </template>

      <v-card>
        <v-card-text> {{ studio?.name }}を削除しますか？ </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text="削除"
            color="error"
            width="90"
            @click="onDestroy"
          ></v-btn>
          <v-btn text="キャンセル" width="90" @click="isDialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped>
.v-list-item {
  padding-inline-start: 0 !important;
}
</style>
