<script setup lang="ts">
  import { useDisplay } from 'vuetify'
  import type { ErrorResponse } from "@/type/api/ErrorResponse";

  const { smAndDown ,mdAndUp } = useDisplay()
  const { auth, logout } = useAuth()
  const { isDrawer } = useDrawer();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const signout = async () => {
    await logout()
      .then(() => {
        showSnackbar("ログアウトに成功しました", "success");
        router.push("/signin");
      })
      .catch((errorResponse: ErrorResponse) => {
        showSnackbar(errorResponse.data.message, "error");
      })
      .finally(() => {
        //
      });
  };

</script>

<template>
  <v-app-bar color="primary" >
    <template v-slot:prepend>
      <v-app-bar-nav-icon v-if="smAndDown && !mdAndUp && auth" @click="isDrawer = !isDrawer"></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>
      管理画面
    </v-app-bar-title>

    <template v-if="auth" v-slot:append>
      <v-badge
          color="success accent-4"
          content="6"
          offset-x="10"
          offset-y="10"
        overlap
      >
      <v-btn icon block>
        <v-icon size="large">mdi-bell</v-icon>
      </v-btn>
    </v-badge>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" class="ml-2 mr-5">
            <v-avatar>
              <v-img
                v-if="auth.image"
                :src="auth.image"
                :alt="auth.nickname ?? 'ニックネーム'"
              />
              <v-icon v-else size="40" color="white">mdi-account-circle</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
            <v-list>
              <v-list-item
                lines="two"
                :prepend-avatar="auth?.image ?? undefined"
                :title="auth?.nickname ?? auth?.fullName ?? ''"
                :subtitle="auth?.email ?? ''"
              >     
              <template v-slot:prepend>
                <v-avatar>
                  <v-img
                    v-if="auth.image"
                    :src="auth.image"
                    :alt="auth.nickname ?? 'ニックネーム'"
                  />
                  <v-icon v-else size="48" color="primary">mdi-account-circle</v-icon>
                </v-avatar>
              </template>
              </v-list-item>              
            </v-list>
            
            <v-divider></v-divider>

            <v-list density="compact" nav>
              <v-list-item prepend-icon="mdi-account-outline" title="アカウント" to="/account"></v-list-item>
              <v-list-item prepend-icon="mdi-email-outline" title="メールアドレス" to="/account/email"></v-list-item>
              <v-list-item prepend-icon="mdi-lock-outline" title="パスワード" to="/account/password"></v-list-item>
              <v-list-item prepend-icon="mdi-logout" title="ログアウト" @click="signout"></v-list-item>
              <v-list-group value="その他のアカウント">
                <template v-slot:activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-account-multiple-outline"
                    title="その他のアカウント"
                  ></v-list-item>
                </template>
                <v-list-item>
                  <v-list-item-title>
                    <div class="flex items-center justify-start">
                      <v-icon size="32" color="primary">mdi-account-circle</v-icon>
                      <div class="flex flex-col">
                        <span class="pl-2 text-sm">アカウントA</span>
                        <v-label>
                          <span class="pl-2 text-xs">t.ichikawa1@versionx.jp</span>
                        </v-label>
                      </div>
                    </div>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <div class="flex items-center justify-start">
                      <v-icon size="32" color="primary">mdi-account-circle</v-icon>
                      <div class="flex flex-col">
                        <span class="pl-2 text-sm">アカウントB</span>
                        <v-label>
                          <span class="pl-2 text-xs">t.ichikawa2@versionx.jp</span>
                        </v-label>
                      </div>
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list-group>
              <v-list-item prepend-icon="mdi-plus" title="アカウントを追加" to="/account"></v-list-item>
            </v-list>
        </v-card>
      </v-menu>
    </template>
  </v-app-bar>
</template>