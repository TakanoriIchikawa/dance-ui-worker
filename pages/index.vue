<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

const { breadcrumbs } = useBreadcrumbs();

breadcrumbs.value = [{ title: "ホーム", to: "/" }];
</script>

<template>
  <div>
    トップページ、担当者のスケジュールとお知らせを通知
  </div>
</template>
