<script setup lang="ts">
import type { Gender } from "@/types/common/Gender";
import type { Plan } from "@/interface/entities/Organization";

interface Props {
  isLoading: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

interface Emits {
  (event: "prev"): void;
  (event: "next"): void;
}

const emits = defineEmits<Emits>();

const { worker, organization, plan, cardToken } = useOrganizationRegisterInfo();

const onGenderText = (gender: Gender): string => {
  return genderText(gender);
};

const onPlanText = (plan: Plan): string => {
  return planText(plan);
};

const onPrev = () => {
  emits("prev");
};

const onNext = async () => {
  emits("next");
};
</script>

<template>
  <v-form ref="formElement">
    <p class="mb-3">申込内容を確認してください</p>
    <v-label>代表者情報</v-label>
    <v-list>
      <v-list-item>
        <v-list-item-subtitle>
          <span class="text-xs">氏名</span>
        </v-list-item-subtitle>
        <v-list-item-title>
          {{ worker?.lastName }} {{ worker?.firstName }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-subtitle>
          <span class="text-xs">フリガナ</span>
        </v-list-item-subtitle>
        <v-list-item-title>
          {{ worker?.lastNameKana }} {{ worker?.firstNameKana }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-subtitle>
          <span class="text-xs">性別</span>
        </v-list-item-subtitle>
        <v-list-item-title>
          {{ worker?.gender ? onGenderText(worker.gender) : "" }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-subtitle>
          <span class="text-xs">生年月日</span>
        </v-list-item-subtitle>
        <v-list-item-title>
          {{ worker?.dateOfBirth }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-subtitle>
          <span class="text-xs">メールアドレス</span>
        </v-list-item-subtitle>
        <v-list-item-title>
          {{ worker?.email }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-subtitle>
          <span class="text-xs">電話番号</span>
        </v-list-item-subtitle>
        <v-list-item-title>
          {{ worker?.tel }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-subtitle>
          <span class="text-xs">郵便番号</span>
        </v-list-item-subtitle>
        <v-list-item-title>
          {{ worker?.postalCode }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-subtitle>
          <span class="text-xs">住所</span>
        </v-list-item-subtitle>
        <v-list-item-title>
          {{ worker?.prefecture }}{{ worker?.city }}{{ worker?.town
          }}{{ worker?.building }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider class="mb-4 border-2 border-gray-900"></v-divider>

    <v-label>団体・法人情報</v-label>
    <v-list>
      <v-list-item>
        <v-list-item-subtitle>
          <span class="text-xs">組織名</span>
        </v-list-item-subtitle>
        <v-list-item-title>
          {{ organization?.name }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-subtitle>
          <span class="text-xs">フリガナ</span>
        </v-list-item-subtitle>
        <v-list-item-title>
          {{ organization?.nameKana }}
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
          {{ organization?.postalCode }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-subtitle>
          <span class="text-xs">住所</span>
        </v-list-item-subtitle>
        <v-list-item-title>
          {{ organization?.prefecture }}{{ organization?.city
          }}{{ organization?.town }}{{ organization?.building }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider class="mb-4 border-2 border-gray-900"></v-divider>

    <v-label>契約プラン</v-label>
    <v-list>
      <v-list-item>
        <v-list-item-subtitle>
          <span class="text-xs">プラン名</span>
        </v-list-item-subtitle>
        <v-list-item-title>
          {{ plan ? onPlanText(plan) : "" }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider class="mb-4 border-2 border-gray-900"></v-divider>

    <template v-if="cardToken">
      <v-label>支払い情報</v-label>
      <v-list>
        <v-list-item>
          <v-list-item-subtitle>
            <span class="text-xs">カード番号</span>
          </v-list-item-subtitle>
          <v-list-item-title>
            **** **** **** {{ cardToken.card?.last4 }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-subtitle>
            <span class="text-xs">有効期限</span>
          </v-list-item-subtitle>
          <v-list-item-title>
            {{ cardToken.card?.exp_month }} /
            {{ cardToken.card?.exp_year }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-subtitle>
            <span class="text-xs">カード名義</span>
          </v-list-item-subtitle>
          <v-list-item-title>
            {{ cardToken.card?.name }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-subtitle>
            <span class="text-xs">決済金額</span>
          </v-list-item-subtitle>
          <v-list-item-title>
            <v-icon size="xs">mdi-currency-jpy</v-icon>3,300
          </v-list-item-title>
          <p class="text-sm mt-2">
            ※
            初回決済以降は、毎月同日に決済されます。ただし、月末日が存在しない場合は、その月の最終日が決済日となります。
          </p>
        </v-list-item>
      </v-list>

      <v-divider class="mb-4 border-2 border-gray-900"></v-divider>
    </template>

    <v-label>ログインパスワード</v-label>
    <p class="text-sm mt-2 mb-4">ご入力いただいたログインパスワード</p>

    <v-divider class="mb-5 border-2 border-gray-900"></v-divider>

    <div class="flex items-center justify-between">
      <v-btn
        color=""
        size="large"
        variant="tonal"
        class=""
        :loading="isLoading"
        :disabled="isLoading"
        @click="onPrev"
      >
        前へ
      </v-btn>
      <v-btn
        color="primary"
        size="large"
        variant="elevated"
        class=""
        :loading="isLoading"
        :disabled="isLoading"
        @click="onNext"
      >
        申込
      </v-btn>
    </div>
  </v-form>
</template>

<style scoped>
.v-list-item {
  padding-inline-start: 0 !important;
}
</style>
