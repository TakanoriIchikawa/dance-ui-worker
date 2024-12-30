<script setup lang="ts">
import dayjs from "dayjs";

interface Props {
  date: string,
  clearable: boolean,
  label: string;
  placeholder: string;
  variant: "outlined" | "filled" | "underlined" | "plain" | "solo" | "solo-inverted" | "solo-filled";
  density: "default" | "comfortable" | "compact";
  hideDetails: boolean | "auto";
  bgColor: string,
  className: string,
}

const props = withDefaults(defineProps<Props>(), {
  date: dayjs().format("YYYY-MM-DD"),
  clearable: true,
  label: "",
  placeholder: "",
  variant: "outlined",
  density: "compact",
  hideDetails: "auto",
  bgColor: "white",
  className: ""
});

interface Emits {
  (event: "selectedDate", date: string): void;
}

const emits = defineEmits<Emits>();

const isMenu = ref<boolean>(false)
const inputDate = ref<string>(props.date)
const picker = ref()

watch(() => props.date, (newVal: string) => {
  inputDate.value = newVal || "";
})

const onSelectedDate = (selectedDate: Date) => {
  if (selectedDate) {
    const date = dayjs(selectedDate)
    inputDate.value = `${date.year()}-${date.month() + 1}-${date.date()}`
    isMenu.value = false;
    emits("selectedDate", inputDate.value);
  }
}

</script>

<template>
  <v-menu
    v-model="isMenu"
    :close-on-content-click="false"
  >
      <template v-slot:activator="{ props }">
        <v-text-field
          v-model="inputDate"
          v-bind="props"
          :clearable="clearable"
          :label="label"
          :placeholder="placeholder"
          :variant="variant"
          :density="density"
          :hide-details="hideDetails"
          :bg-color="bgColor"
          :class="className"
        >
        </v-text-field>
      </template>
      <v-locale-provider locale="ja">
        <v-date-picker
          v-model="picker"
          hide-header
          hide-actions
          @update:model-value="onSelectedDate($event)"
        >
        </v-date-picker>
      </v-locale-provider>
    </v-menu>
</template>


