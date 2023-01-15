<template>
  <v-container>
    <v-card title="Summary">
      <template v-slot:prepend>
        <v-icon class="dumbbell-icon" color="secondary"
          >mdi-clipboard-check-multiple-outline</v-icon
        >
      </template>
      <v-card-text>
        <v-row class="center-btns">
          <v-col class="done-todo">
            <v-avatar size="60" :color="'secondary'">
              {{ storeWorkouts.workoutSummary.done }} </v-avatar
            ><br />
            <v-divider thickness="0px"></v-divider>
            Done
          </v-col>
          <v-col class="done-todo">
            <v-avatar size="60" :color="'error'">
              {{ storeWorkouts.workoutSummary.todo }} </v-avatar
            ><br />
            <v-divider thickness="0px"></v-divider>
            To Do
          </v-col>
        </v-row>
        <v-divider class="divider" thickness="1px"></v-divider>
        <v-slide-group>
          <v-slide-group-item
            v-for="(item, index) in storeWorkouts.workoutSummary.types"
            :key="index"
          >
            <div class="types-avatar">
              <v-avatar :color="'secondary'"> {{ item.value }} </v-avatar><br />
              <v-divider thickness="0px"></v-divider>
              {{ item.type }}
            </div>
          </v-slide-group-item>
        </v-slide-group>
      </v-card-text>
    </v-card>
    <v-divider thickness="0px"></v-divider>
    <v-card>
      <v-card-title>
        <v-icon class="dumbbell-icon" color="secondary">mdi-dumbbell</v-icon>
        Generate Random
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              v-model="time"
              type="number"
              :rules="[(v) => v >= 0 || 'Time must be greater than 0']"
              label="Max time (min)"
              required
            ></v-text-field>
          </v-col>
          <v-col class="d-flex justify-center">
            <v-btn
              class="go-btn"
              prepend-icon="mdi-weight-lifter"
              color="secondary"
              @click="generateWorkout"
            >
              GO
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-divider thickness="0px"></v-divider>

    <v-card>
      <v-card-title>
        <v-icon color="secondary">mdi-checkbox-marked-circle-outline</v-icon>
        Week Overview
      </v-card-title>
      <v-card-text>
        <v-timeline direction="horizontal" line-inset="8" truncate-line="both">
          <v-timeline-item
            v-for="(item, index) in storeWorkouts.timeline"
            size="x-small"
            :key="index"
            :dot-color="storeWorkouts.timeline[index].color"
            @click="
              showWorkoutDone = true;
              selectedDay = item;
            "
          >
            <template v-if="index % 2 !== 0"> {{ item.day }} </template>
            <template v-if="index % 2 === 0" v-slot:opposite>
              {{ item.day }}
            </template>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>
    <v-divider thickness="0px"></v-divider>
    <v-card>
      <v-card-title>
        <v-icon color="secondary">mdi-swap-horizontal</v-icon>
        Exchange WODs
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="d-flex justify-center">
            <v-btn variant="outlined" append-icon="mdi-arrow-top-right">
              Send
              <PreviewList
                v-if="storeWorkouts.allWorkouts.length > 0"
                v-bind:workouts="storeWorkouts.allWorkouts"
                v-bind:action="'export'"
                v-on:downloaded-workouts="downloadedWorkouts"
              ></PreviewList>
            </v-btn>
          </v-col>
          <v-col class="d-flex justify-center">
            <v-btn variant="outlined" prepend-icon="mdi-arrow-bottom-left">
              Receive
              <QrcodeReader
                v-on:preview-imported-workouts="previewImportedWorkouts"
              />
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showWorkoutDone">
      <v-card
        class="workouts-done-card"
        :title="getDay(selectedDay.day) + ' Workouts'"
        style="overflow-y: auto"
      >
        <template v-slot:prepend>
          <v-icon class="dumbbell-icon" color="secondary">mdi-history</v-icon>
        </template>
        <v-divider thickness="0px"></v-divider>
        <div
          v-for="(workout, index) in getWorkoutsDone()"
          :key="index"
          width="95%"
        >
          <v-divider></v-divider>
          <v-card
            :title="workout.name"
            :subtitle="workout.type + ' - ' + workout.time + ' min'"
          >
            <template v-slot:prepend>
              <v-icon size="small" color="secondary">mdi-weight-lifter</v-icon>
            </template>
            <v-card-text
              style="text-align: center"
              v-html="workout.exercises.replaceAll('\n', '<br/>')"
            >
            </v-card-text>
          </v-card>
        </div>
      </v-card>
    </v-dialog>

    <PreviewList
      v-model="imported"
      v-if="imported && importedWorkouts.length > 0"
      v-bind:workouts="importedWorkouts"
      v-bind:action="'import'"
    ></PreviewList>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
      <template v-slot:actions>
        <v-btn :color="color" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import PreviewList from "@/components/pop-ups/PreviewList.vue";
import QrcodeReader from "@/components/pop-ups/QrcodeReader.vue";
import { useStoreWorkouts } from "@/stores/storeWorkouts";
import { useRouter } from "vue-router";

const storeWorkouts = useStoreWorkouts();
const router = useRouter();

const time = ref(null);
const importedWorkouts = ref([]);
const imported = ref(false);
const snackbar = ref(false);
const color = ref("");
const text = ref("");
const timeout = ref(2000);
const showWorkoutDone = ref(false);
const selectedDay = ref("");

const downloadedWorkouts = (fileName) => {
  if (fileName !== "") {
    text.value = fileName + " exported to Documents folder.";
    snackbar.value = true;
    color.value = "secondary";
  }
};

const generateWorkout = () => {
  const validList =
    time.value !== null
      ? generateValidWorkoutsList()
      : [...storeWorkouts.allWorkouts];
  if (validList.length > 1) {
    let workout = {};
    do {
      workout = validList[Math.floor(Math.random() * validList.length)];
    } while (workout.id === storeWorkouts.currentWorkout.id);
    storeWorkouts.selectWorkout(workout);
    router.push({ name: "workout-view" });
  } else if (validList.length === 1) {
    storeWorkouts.selectWorkout(validList[0]);
    router.push({ name: "workout-view" });
  } else {
    snackbar.value = true;
    color.value = "error";
    text.value =
      "There is no workout with less than " + time.value + " minutes.";
  }
};

const generateValidWorkoutsList = () => {
  let validList = [];
  for (const workout of storeWorkouts.allWorkouts) {
    if (workout.time <= time.value) validList = [...validList, workout];
  }
  return validList;
};

const getDay = (day) => {
  switch (day) {
    case "Wed":
      return "Wednesday";
    case "Thu":
      return "Thrusday";
    case "Sat":
      return "Saturday";
    case "Mon":
    case "Tue":
    case "Fri":
    case "Sun":
      return day + "day";
  }
};

const getWorkoutsDone = () => {
  let workoutsList = [];
  selectedDay.value.workoutsId.forEach((id) => {
    workoutsList.push(storeWorkouts.allWorkouts.find((e) => e.id === id));
  });
  return workoutsList;
};

const previewImportedWorkouts = (workouts) => {
  importedWorkouts.value = JSON.parse(workouts);
  imported.value = true;
};
</script>

<style>
.v-divider {
  margin-top: 5px;
  margin-bottom: 5px;
}
.divider {
  margin-top: 15px;
  margin-bottom: 15px;
}

.go-btn {
  margin-top: 10px;
}

.dumbbell-icon {
  font-size: 23px;
}

.center-btns {
  text-align: center;
}

.done-todo {
  font-size: 20px;
  font-weight: bold;
}

.types-avatar {
  text-align: center;
  margin-right: 15px;
  margin-left: 15px;
}

.v-slide-group__content {
  justify-content: center;
}

.workouts-done-card {
  max-height: 600px;
  overflow-y: auto;
}
</style>
