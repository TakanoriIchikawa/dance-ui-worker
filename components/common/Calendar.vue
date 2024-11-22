<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventInput } from "@fullcalendar/core";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

interface Props {
  events: EventInput[];
}

const props = withDefaults(defineProps<Props>(), {
  events: () => [],
});

interface Emits {
  (event: "addSchedule", title: string, start: Dayjs, end: Dayjs): void;
  (event: "editSchedule", title: string, start: Dayjs, end: Dayjs): void;
}

const emits = defineEmits<Emits>();

const calender = ref<InstanceType<typeof FullCalendar>>();
const targetDate = ref<Dayjs>()
const isAddScheduleDialog = ref<boolean>(false);
const isEditScheduleDialog = ref<boolean>(false);

const onOpenAddScheduleDialog = (arg: EventInput) => {
  isAddScheduleDialog.value = true;
  if (arg.date instanceof Date) {
    targetDate.value = dayjs(arg.date)
  }
};

const onOpenEditScheduleDialog = (arg: EventInput) => {
  isEditScheduleDialog.value = true;

  const event = arg.event;

  console.log("発火");
  console.log(event);

  if (event.start instanceof Date && event.end instanceof Date) {
    targetDate.value = dayjs(event.start)
  }
};

const addSchedule = () => {
  if (targetDate.value) {
    emits("addSchedule", "テストAA", targetDate.value, targetDate.value);
  }
}

const editSchedule = () => {
  if (targetDate.value) {
    emits("editSchedule", "テストB", targetDate.value, targetDate.value);
  }
}

const moveSchedule = (arg: EventInput) => {
  console.log("移動した");
  console.log(arg.event);
};

// const prev = () => {
//   calender.value?.getApi().prev()
// }

// const next = () => {
//   calender.value?.getApi().next()
// }

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  locale: "ja",
  editable: true,
  selectable: true,
  events: props.events,
  dateClick: onOpenAddScheduleDialog,
  eventClick: onOpenEditScheduleDialog,
  eventDrop: moveSchedule,
  // customButtons: {
  //   prevButton: { icon: 'chevron-left', click: () => prev() },
  //   nextButton: { icon: 'chevron-right', click: () => prev() },
  // },
  headerToolbar: {
    left: "today",
    center: "prev,title,next",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  buttonText: {
    today: "今日",
    month: "月",
    week: "週",
    day: "日",
  },
});
</script>

<template>
  <div>
    <FullCalendar
      ref="calender"
      :options="calendarOptions"
      title-format="{ year: 'numeric', month: 'long' }"
    >
      <template v-slot:eventContent="arg">
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template>
    </FullCalendar>

    <v-dialog
        v-model="isAddScheduleDialog"
        max-width="400"
        origin="top center"
      >
        <v-card>
          <v-card-text
            >{{
              targetDate?.format("YYYY年MM月DD日")
            }}にイベントを追加しますか？</v-card-text
          >

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text="キャンセル"
              width="90"
              @click="isAddScheduleDialog = false"
            ></v-btn>
            <v-btn
              text="登録"
              color="error"
              width="90"
              @click="addSchedule"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="isEditScheduleDialog"
        max-width="400"
        origin="top center"
      >
        <v-card>
          <v-card-text>{{
              targetDate?.format("YYYY年MM月DD日")
            }}のイベントを編集しますか？</v-card-text
          >

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text="キャンセル"
              width="90"
              @click="isEditScheduleDialog = false"
            ></v-btn>
            <v-btn
              text="更新"
              color="error"
              width="90"
              @click="editSchedule"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </div>
</template>

<style>
.fc-toolbar-chunk div {
  display: flex;
  align-items: center;
}

.fc .fc-toolbar-title {
  text-align: center;
  font-size: 1.25rem;
  min-width: 120px;
}

.fc-button {
  background-color: transparent !important;
  color: #757575 !important;
  border: none !important;
}

.fc-button:hover {
  background-color: #f5f5f5 !important;
}

.fc-button:focus {
  box-shadow: none !important;
  outline: none !important;
}

.fc-prev-button {
  padding: 0 !important;
  padding-block-end: 30px !important;
  margin-inline-end: 10px !important;
  height: 30px !important;
  width: 30px !important;
}
.fc-next-button {
  padding: 0 !important;
  padding-block-end: 30px !important;
  margin-inline-start: 10px !important;
  height: 30px !important;
  width: 30px !important;
}
</style>
