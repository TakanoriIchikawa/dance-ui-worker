<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

const router = useRouter();
const { auth } = useAuth();
const { organization, find } = useOrganization();

const organizationId = computed((): string => {
  return String(auth.value?.organizationId);
});

await useAsyncData("findOrganizationData", async () => {
  await find(organizationId.value);
  return { organization: organization.value };
});
</script>

<template>
  <v-row justify="center">
    <v-col cols="12" sm="10" md="9" lg="8" xl="7">
      <v-card class="relative">
        <v-card-title>
          契約情報
        </v-card-title>
        <v-card-item>
          <v-list lines="one">
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">団体・組織名</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ organization?.name }}
                <v-label>
                  <span class="text-xs">（{{ organization?.nameKana }}）</span>
                </v-label>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">代表者氏名</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ organization?.lastName }} {{ organization?.firstName }}
                <v-label>
                  <span class="text-xs">（{{ organization?.lastNameKana }} {{ organization?.firstNameKana }}）</span>
                </v-label>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">ご契約プラン</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ organization?.planText }}
                <v-label>
                  <span class="text-xs">（月々 ¥{{ (organization?.planMonthlyFee)?.toLocaleString() }}）</span>
                </v-label>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">メールアドレス</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ organization?.email }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">電話番号</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ organization?.tel }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">郵便番号</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                〒 {{ organization?.postalCode }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">住所</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ organization?.prefecture }}{{ organization?.town }}{{ organization?.city }}{{ organization?.building }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-xs">ご契約日時</span>
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ organization?.createdAt }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-item>
      </v-card>
    </v-col>

    <v-col cols="12" sm="10" md="9" lg="8" xl="7">
      <v-card>
        <v-card-title>
          <div class="flex items-center justify-between">
            <v-label>入会金・年会費等</v-label>
            <v-btn
              class=""
              size="48"
              variant="text"
              color="primary"
              min-width="100"
            >
              <v-icon size="20">mdi-pencil</v-icon>
              <span class="text-base">編集</span>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <OrganizationFeeTable></OrganizationFeeTable>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
