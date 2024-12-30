<script setup lang="ts">
import { useDisplay } from "vuetify";

const router = useRouter();
const { organization } = useOrganization();
const { smAndDown } = useDisplay();

const organizationFeeHeaders = computed(() => {
  if (smAndDown.value) {
    return organizationFeeDefaultHeaders.value.filter((item) => item.isShowMobile);
  }
  return organizationFeeDefaultHeaders.value;
});

const organizationFeeDefaultHeaders = ref([
  {
    key: "name",
    title: "項目名",
    align: "start" as const,
    sortable: true,
    nowrap: true,
    isShowMobile: true,
  },
  {
    key: "fee",
    title: "料金",
    align: "start" as const,
    sortable: false,
    nowrap: true,
    isShowMobile: true,
  },
  {
    key: "isJoinPayment",
    title: "入会時支払",
    align: "start" as const,
    sortable: false,
    nowrap: true,
    isShowMobile: true,
  },
  {
    key: "paymentCycleText",
    title: "支払頻度",
    align: "start" as const,
    sortable: false,
    nowrap: true,
    isShowMobile: true,
  },
  {
    key: "paymentMonth",
    title: "支払月",
    align: "start" as const,
    sortable: false,
    nowrap: true,
    isShowMobile: true,
  },
  {
    key: "paymentDay",
    title: "支払日",
    align: "start" as const,
    sortable: false,
    nowrap: true,
    isShowMobile: true,
  },
]);
</script>

<template>
  <v-data-table-server
    :headers="organizationFeeHeaders"
    :items="organization?.organizationFees"
    :items-length="organization?.organizationFees?.length ?? 0"
    mobileBreakpoint="sm"
    return-object
    hover
  >
    <template #no-data>データが存在しません</template>
    <template #bottom></template>
    <template #[`item.fee`]="{ item }">
      ¥{{ item.fee.toLocaleString() }}
    </template>
    <template #[`item.isJoinPayment`]="{ item }">
      {{ item.isJoinPayment ? '支払う' : '支払わない' }}
    </template>
    <template #[`item.paymentMonth`]="{ item }">
      {{ item.paymentMonth ? `${item.paymentMonth}月` : (item.paymentMonth === 0 ? '入会月' : '') }}
    </template>
    <template #[`item.paymentDay`]="{ item }">
      {{ item.paymentDay ? `${item.paymentDay}日` : (item.paymentDay === 0 ? '入会日' : '') }}
    </template>
  </v-data-table-server>
</template>
