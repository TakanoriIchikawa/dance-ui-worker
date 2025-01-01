<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

const { breadcrumbs } = useBreadcrumbs();
const isAlert = ref<boolean>(true)

breadcrumbs.value = [
  { title: "ホーム", to: "/" },
  { title: "通知", to: "/notification" },
];

</script>

<template>
  <div>
    <v-row dense justify="center">
      <v-col cols="12" sm="10" md="9" lg="8" xl="7">
        <div class="bg-white">
          <v-alert
            v-model="isAlert"
            border="start"
            color="success"
            bg-color="white"
            variant="tonal"
            elevation="4"
            closable
          >
            <nuxt-link to="/chat" >未読のメッセージがあります</nuxt-link>
          </v-alert>
        </div>

      </v-col>
    </v-row>
  </div>
</template>
