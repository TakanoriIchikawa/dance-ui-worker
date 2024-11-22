<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

const { auth } = useAuth();
const { breadcrumbs } = useBreadcrumbs();


breadcrumbs.value = [
  { title: "ホーム", to: "/" },
  { title: "アカウント", to: "/account" },
  { title: "パスワード", to: "/account/password" },
];

</script>

<template>
  <div>
    パスワード変更
  </div>
</template>