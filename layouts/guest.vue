<script setup lang="ts"></script>

<template>
  <v-app>
    <CommonHeader />
    <v-main class="bg-gray-200">
      <v-container>
        <slot />
      </v-container>
    </v-main>
    <CommonFooter />
    <CommonSnackbar />
  </v-app>
</template>
