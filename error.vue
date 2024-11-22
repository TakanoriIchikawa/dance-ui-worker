<script lang="ts" setup>
const handleError = () => clearError({ redirect: '/' });
const error = useError();
const errorStatusMessage = ref<string>("")
const errorTextMessage = ref<string>("")

switch (error.value?.statusCode) {
  case 400:
    errorStatusMessage.value = "Bad Request";
    errorTextMessage.value = "リクエスト内容に問題があります。入力内容を再確認してください。";
    break;
  case 401:
    errorStatusMessage.value = "Unauthorized";
    errorTextMessage.value = "認証トークンまたはページの有効期限が切れています。再ログインを行ってください。";
    break;
  case 403:
    errorStatusMessage.value = "Forbidden";
    errorTextMessage.value = "このページにアクセスする権限がありません。";
    break;
  case 404:
    errorStatusMessage.value = "Page Not Found";
    errorTextMessage.value = "お探しのページは存在しません。URLを再確認してください。";
    break;
  case 500:
    errorStatusMessage.value = "Internal Server Error";
    errorTextMessage.value = "システムエラーが発生しました。時間を置いて再度お試しください。";
    break;
  case 503:
    errorStatusMessage.value = "Service Unavailable";
    errorTextMessage.value = "現在サービスをご利用いただけません。しばらくしてから再度アクセスしてください。";
    break;
  default:
    errorStatusMessage.value = "Unknown Error";
    errorTextMessage.value = "予期しないエラーが発生しました。サポートまでご連絡ください。";
}

</script>

<template>
  <NuxtLayout>
    <v-empty-state
      :headline="`Whoops, ${error?.statusCode || 500}`"
      :title="errorStatusMessage"
      :text="errorTextMessage"
      image="https://vuetifyjs.b-cdn.net/docs/images/logos/v.png"
    >
      <template v-slot:actions>
        <NuxtLink to="/" class="text-blue-500">ホームへ戻る</NuxtLink>
      </template>
    </v-empty-state>
  </NuxtLayout>
</template>
