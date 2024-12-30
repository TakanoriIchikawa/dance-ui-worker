<script setup lang="ts">
import { VForm } from "vuetify/components";
import { loadStripe } from "@stripe/stripe-js";
import type { TokenResult } from "@stripe/stripe-js";
import type { Plan } from "@/interface/entities/Organization"

interface Emits {
  (event: "prev"): void;
  (event: "next"): void;
}

const emits = defineEmits<Emits>();

const { plan, cardToken } = useOrganizationRegisterInfo();
const { errors } = useErrors();
const { stripePublicKey } = useRuntimeConfig().public as { stripePublicKey: string; };
const stripe = await loadStripe(stripePublicKey);
const elements = stripe?.elements();
const elementClasses = {
  base: "custom-base-class",
  complete: "custom-complete-class",
  empty: "custom-empty-class",
  focus: "custom-focus-class",
  invalid: "custom-invalid-class",
};

const elementStyles = {
  base: {
    fontSize: "16px",
  },
};

const cardNumber = elements?.create("cardNumber", {
  classes: elementClasses,
  style: elementStyles,
});
const cardExpiry = elements?.create("cardExpiry", {
  classes: elementClasses,
  style: elementStyles,
});
const cardCvc = elements?.create("cardCvc", {
  placeholder: "123",
  classes: elementClasses,
  style: elementStyles,
});

const cardHolderName = ref<HTMLElement>();
const selectedPlan = ref<Plan>(plan.value ? plan.value : 'starter');

onMounted(() => {
  cardNumber?.mount("#card-number");
  cardExpiry?.mount("#card-expiry");
  cardCvc?.mount("#card-cvc");

  cardNumber?.on("change", (event) => {
    if (event.error) {
      errors.value.cardNumber = event.error.message;
    }

    if (event.complete) {
      errors.value.cardNumber = null;
      cardExpiry?.focus();
    }
  });

  cardExpiry?.on("change", (event) => {
    if (event.error) {
      errors.value.cardExpiry = event.error.message;
    }

    if (event.complete) {
      errors.value.cardExpiry = null;
      cardCvc?.focus();
    }
  });

  cardCvc?.on("change", (event) => {
    if (event.error) {
      errors.value.cardCvc = event.error.message;
    }

    if (event.complete) {
      errors.value.cardCvc = null;
      cardHolderName.value?.focus();
    }
  });
});

const onPrev = () => {
  emits("prev");
};

const onNext = async () => {
  plan.value = selectedPlan.value
  if (selectedPlan.value === 'starter') {
    emits("next");
    return
  }

  if (cardNumber && stripe) {
    const result: TokenResult = await stripe.createToken(cardNumber, {
      name: (cardHolderName.value as HTMLInputElement)?.value,
    });

    if (result?.token) {
      cardToken.value = result.token
      emits("next");
    }
  }
};
</script>

<template>
  <v-form ref="formElement">
    <p>契約プランを選択してください</p>
    <v-table>
      <thead>
        <tr>
          <th class="text-center min-w-40 w-44">プラン名</th>
          <th class="text-center min-w-40 w-44">最大登録生徒数</th>
          <th class="text-center min-w-40">料金（月額）</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>スターター</td>
          <td class="text-center">20名</td>
          <td class="text-center">無料</td>
        </tr>
        <tr>
          <td>ベーシック</td>
          <td class="text-center">50名</td>
          <td class="text-center">
            <v-icon size="xs">mdi-currency-jpy</v-icon>3,300<span
              class="pl-1 text-xs text-red-600"
              >※注</span
            >
          </td>
        </tr>
        <tr>
          <td>スタンダード</td>
          <td class="text-center">100名</td>
          <td class="text-center">
            <v-icon size="xs">mdi-currency-jpy</v-icon>11,000<span
              class="pl-1 text-xs text-red-600"
              >※注</span
            >
          </td>
        </tr>
        <tr>
          <td>プラス</td>
          <td class="text-center">300名</td>
          <td class="text-center">
            <v-icon size="xs">mdi-currency-jpy</v-icon>33,000<span
              class="pl-1 text-xs text-red-600"
              >※注</span
            >
          </td>
        </tr>
        <tr>
          <td>グロース</td>
          <td class="text-center">500名</td>
          <td class="text-center">
            <v-icon size="xs">mdi-currency-jpy</v-icon>55,000<span
              class="pl-1 text-xs text-red-600"
              >※注</span
            >
          </td>
        </tr>
        <tr>
          <td>プロフェッショナル</td>
          <td class="text-center">700名</td>
          <td class="text-center">
            <v-icon size="xs">mdi-currency-jpy</v-icon>77,000<span
              class="pl-1 text-xs text-red-600"
              >※注</span
            >
          </td>
        </tr>
        <tr>
          <td>プレミアム</td>
          <td class="text-center">1000名</td>
          <td class="text-center">
            <v-icon size="xs">mdi-currency-jpy</v-icon>99,000<span
              class="pl-1 text-xs text-red-600"
              >※注</span
            >
          </td>
        </tr>
        <tr>
          <td>エンタープライズ</td>
          <td class="text-center">上限なし</td>
          <td class="text-center">
            <v-icon size="xs">mdi-currency-jpy</v-icon>220,000<span
              class="pl-1 text-xs text-red-600"
              >※注</span
            >
          </td>
        </tr>
      </tbody>
    </v-table>
    <div class="my-3 flex items-start justify-start">
      <span class="text-xs text-red-600 min-w-7 pt-0.5">※注</span>
      <span class="text-sm">決済管理機能をご利用の場合、月額料金に加えて、各決済ごとに3.8%の決済手数料が発生します。</span>
    </div>

    <v-radio-group
      v-model="selectedPlan"
      hide-details="auto"
    >
      <v-radio label="スターター" value="starter"></v-radio>
      <v-radio label="ベーシック" value="basic"></v-radio>
      <v-radio label="スタンダード" value="standard"></v-radio>
      <v-radio label="グロース" value="growth"></v-radio>
      <v-radio label="プロフェッショナル" value="professional"></v-radio>
      <v-radio label="プレミアム" value="premium"></v-radio>
      <v-radio label="エンタープライズ" value="enterprise"></v-radio>
    </v-radio-group>

    <div v-show="selectedPlan !== 'starter'">
      <v-divider class="my-2"></v-divider>

      <p class="mb-2">支払い情報を入力してください</p>
      <v-row dense>
        <v-col cols="12">
          <v-label for="card-number" class="">カード番号</v-label>
          <div id="card-number" class="py-1 border-b"></div>
          <p v-if="errors.cardNumber" class="text-sm text-red-600">
            {{ errors.cardNumber }}
          </p>
        </v-col>
        <v-col cols="12" sm="6">
          <v-label for="card-expiry" class="">有効期限</v-label>
          <div id="card-expiry" class="py-1 border-b"></div>
          <p v-if="errors.cardExpiry" class="text-sm text-red-600">
            {{ errors.cardExpiry }}
          </p>
        </v-col>
        <v-col cols="12" sm="6">
          <v-label for="card-cvc" class="">セキュリティコード</v-label>
          <div id="card-cvc" class="py-1 border-b"></div>
          <p v-if="errors.cardCvc" class="text-sm text-red-600">
            {{ errors.cardCvc }}
          </p>
        </v-col>
        <v-col cols="12">
          <v-label for="card-holder-name" class="">カード名義</v-label>
          <div id="card-holder-name" class="py-1 border-b">
            <input
              ref="cardHolderName"
              type="text"
              class="block w-full outline-none"
              placeholder="TARO YAMADA"
            />
          </div>
        </v-col>
      </v-row>
    </div>

    <v-divider class="my-3"></v-divider>

    <div class="flex items-center justify-between">
      <v-btn
        color=""
        size="large"
        variant="tonal"
        class=""
        @click="onPrev"
      >
        前へ
      </v-btn>
      <v-btn
        color="primary"
        size="large"
        variant="elevated"
        class=""
        @click="onNext"
      >
        次へ
      </v-btn>
    </div>
  </v-form>
</template>
