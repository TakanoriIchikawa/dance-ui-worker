<script setup lang="ts">
const { breadcrumbs } = useBreadcrumbs()
</script>

<template>
  <v-breadcrumbs :items="breadcrumbs" class="overflow-scroll">
    <template v-slot:item="{ item }">
      <nuxt-link :to="item.to" class="whitespace-nowrap">
        {{ item.title }}
      </nuxt-link>
    </template>
  </v-breadcrumbs>
</template>
