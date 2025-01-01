<script setup lang="ts">
const { snackbar } = useSnackbar()
</script>

<template>
  <v-snackbar
    v-model="snackbar.isShow"
    :location="snackbar.location"
    :timeout="3000"
    :color="snackbar.color"
    variant="tonal"
  >
    <p>{{ snackbar.message }}</p>
    <template #actions>
      <v-btn icon small @click="snackbar.isShow = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
