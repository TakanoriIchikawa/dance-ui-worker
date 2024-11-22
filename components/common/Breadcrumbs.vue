<script setup lang="ts">
const { breadcrumbs } = useBreadcrumbs()
</script>

<template>
  <v-breadcrumbs :items="breadcrumbs">
    <template v-slot:item="{ item }">
      <nuxt-link :to="item.to">
        {{ item.title }}
      </nuxt-link>
    </template>
  </v-breadcrumbs>
</template>
