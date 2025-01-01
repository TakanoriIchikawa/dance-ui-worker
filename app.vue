<script setup lang="ts">
const { auth } = useAuth();
onMounted(() => {
  if (auth.value) {
    connectWebSocket()
  }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
