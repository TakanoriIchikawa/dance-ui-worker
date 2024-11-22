<script setup lang="ts"></script>

<template>
  <v-app>
    <CommonHeader />
    <CommonSidebar />
    <v-main class="bg-gray-200">
      <v-container>
        <CommonBreadcrumbs></CommonBreadcrumbs>
        <slot />
      </v-container>
    </v-main>
    <CommonFooter />
    <CommonSnackbar />
  </v-app>
</template>