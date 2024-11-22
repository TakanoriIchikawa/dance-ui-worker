<script setup lang="ts">
  import { useDisplay } from 'vuetify'

  const { smAndDown, mdAndUp } = useDisplay()
  const { isDrawer } = useDrawer();
  const isRail = ref<boolean>(false)
</script>

<template>
  <v-navigation-drawer
    v-model="isDrawer"
    :rail="isRail"
    :permanent="mdAndUp"
    :temporary="smAndDown"
    @click="isRail = false"
  >
    <v-list>
      <v-list-item prepend-icon="mdi-home" title="ホーム" to="/"></v-list-item>
      <v-list-item prepend-icon="mdi-music-box-outline" title="スタジオ" to="/studio"></v-list-item>
      <v-list-item prepend-icon="mdi-door" title="ルーム" to="/room"></v-list-item>
      <v-list-item prepend-icon="mdi-playlist-music" title="コース" to="/course"></v-list-item>
      <v-list-item prepend-icon="mdi-calendar" title="レッスン" to="/lesson"></v-list-item>
      <!-- <v-list-group value="レッスン">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-calendar" title="レッスン"></v-list-item>
        </template>
        <v-list-item title="スケジュール" to="/lesson/schedule"></v-list-item>
        <v-list-item title="動画" to="/lesson/movie"></v-list-item>
      </v-list-group> -->

      <v-list-item prepend-icon="mdi-account-check" title="講師" to="/worker"></v-list-item>
      <v-list-item prepend-icon="mdi-account-edit" title="契約者" to="/user"></v-list-item>
      <v-list-item prepend-icon="mdi-account-music" title="生徒" to="/student"></v-list-item>
      <v-list-item prepend-icon="mdi-calendar-star" title="イベント" to="/event"></v-list-item>
      <v-list-item prepend-icon="mdi-human-greeting" title="体験申込" to="/experience"></v-list-item>
      <v-list-item prepend-icon="mdi-credit-card" title="支払情報" to="/payment"></v-list-item>
      <v-list-item prepend-icon="mdi-shield-account" title="契約情報" to="/contract"></v-list-item>
    </v-list>

    <template v-slot:append>
      <v-list v-if="mdAndUp">
        <v-list-item v-if="isRail" prepend-icon="mdi-chevron-right" @click.stop="isRail = !isRail"></v-list-item>
        <v-list-item v-else append-icon="mdi-chevron-left" @click.stop="isRail = !isRail"></v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>