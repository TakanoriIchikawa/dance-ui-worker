<script lang="ts" setup>
const handleError = () => clearError({ redirect: '/' });
const error = useError();
const title = ref<string>("")
const message = ref<string>("")

switch (error.value?.statusCode) {
  case 400:
    title.value = "Bad Request";
    message.value = "リクエスト内容に問題があります。入力内容を再確認してください。";
    break;
  case 401:
    title.value = "Unauthorized";
    message.value = "認証トークンまたはページの有効期限が切れています。再ログインを行ってください。";
    break;
  case 403:
    title.value = "Forbidden";
    message.value = "このページにアクセスする権限がありません。";
    break;
  case 404:
    title.value = "Page Not Found";
    message.value = "お探しのページは存在しません。URLを再確認してください。";
    break;
  case 500:
    title.value = "Internal Server Error";
    message.value = "システムエラーが発生しました。時間を置いて再度お試しください。";
    break;
  case 503:
    title.value = "Service Unavailable";
    message.value = "現在サービスをご利用いただけません。しばらくしてから再度アクセスしてください。";
    break;
  default:
    title.value = "Unknown Error";
    message.value = "予期しないエラーが発生しました。サポートまでご連絡ください。";
}

</script>

<template>
  <NuxtLayout>
    <v-empty-state
      :headline="`Whoops, ${error?.statusCode || 500}`"
      :title="title"
      :text="message"
      image="https://vuetifyjs.b-cdn.net/docs/images/logos/v.png"
    >
      <template v-slot:actions>
        <NuxtLink to="/" class="text-blue-500">ホームへ戻る</NuxtLink>
      </template>
    </v-empty-state>
  </NuxtLayout>
</template>
