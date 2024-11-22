<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

const { auth } = useAuth();
const { breadcrumbs } = useBreadcrumbs();


breadcrumbs.value = [
  { title: "ホーム", to: "/" },
  { title: "アカウント", to: "/account" },
  { title: "メールアドレス", to: "/account/email" },
];

</script>

<template>
  <div>
    メールアドレス変更
  </div>
</template>