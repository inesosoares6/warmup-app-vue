<template>
  <v-dialog v-model="printWeeklyReport" activator="parent">
    <div class="workouts-done-card">
      <div
        id="element-to-convert"
        :class="theme.global.name === 'dark' ? 'DARK' : 'LIGHT'"
      >
        <v-card
          title="Weekly Report"
          :subtitle="dateStructured"
          style="overflow-y: auto"
        >
          <template v-slot:append>
            <v-btn
              class="print-button"
              icon
              flat
              size="small"
              @click="printReport"
            >
              <v-icon color="secondary">mdi-printer</v-icon>
            </v-btn>
          </template>
          <v-timeline align="start" class="pa-5 scroll-view">
            <v-timeline-item
              v-for="(item, index) in storeApp.timeline"
              :key="index"
              :dot-color="item.color"
              size="small"
            >
              <template v-slot:opposite>
                <div
                  :class="`pt-1 headline font-weight-bold text-${item.color}`"
                  v-text="item.day"
                ></div>
              </template>
              <div
                v-for="(workout, index) in getWorkoutsDone(item)"
                :key="index"
                width="95%"
              >
                <h2
                  :class="`mt-n1 headline font-weight-light mb-2 text-${item.color}`"
                >
                  {{ workout.name }}
                </h2>
                <h5 :class="`mt-n1 font-weight-light mb-2 text-grey`">
                  {{ workout.type + " - " + workout.time + " min" }}
                </h5>
                <div
                  class="mb-4"
                  v-html="workout.exercises.replaceAll('\n', '<br/>')"
                ></div>
                <v-divider></v-divider>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useStoreApp } from "@/stores/storeApp";
import { useStoreWorkouts } from "@/stores/storeWorkouts";
import html2pdf from "html2pdf.js";
import { useTheme } from "vuetify";
const theme = ref(useTheme());

const date = new Date().toString().split(" ");
const dateStructured = ref(
  date[0] + ", " + date[2] + " " + date[1] + " " + date[3]
);

const storeApp = useStoreApp();
const storeWorkouts = useStoreWorkouts();
const printWeeklyReport = ref(false);

const getWorkoutsDone = (selectedDay) => {
  let workoutsList = [];
  selectedDay.workoutsId.forEach((id) => {
    workoutsList.push(storeWorkouts.allWorkouts[id]);
  });
  return workoutsList;
};

const printReport = () => {
  html2pdf(document.getElementById("element-to-convert"), {
    margin: 1,
    filename: "Weekly Report - " + dateStructured.value,
  });
};
</script>

<style scoped>
.DARK {
  background-color: #212121;
}

.LIGHT {
  background-color: #fafafa;
}
.scroll-view {
  max-height: 500px;
  overflow-y: auto;
}
</style>
