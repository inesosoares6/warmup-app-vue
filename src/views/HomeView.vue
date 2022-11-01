<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-icon class="dumbbell-icon" color="secondary"
          >mdi-clipboard-check-multiple-outline</v-icon
        >
        Summary
      </v-card-title>
      <v-card-text>
        <v-row class="center-btns">
          <v-col class="done-todo">
            <v-avatar size="60" :color="'secondary'">
              {{ workoutSummary.done }} </v-avatar
            ><br />
            <v-divider thickness="0px"></v-divider>
            Done
          </v-col>
          <v-col class="done-todo">
            <v-avatar size="60" :color="'error'">
              {{ workoutSummary.todo }} </v-avatar
            ><br />
            <v-divider thickness="0px"></v-divider>
            To Do
          </v-col>
        </v-row>
        <v-divider class="divider" thickness="1px"></v-divider>
        <v-row class="center-btns">
          <v-col v-for="(item, index) in workoutSummary.types" :key="index">
            <v-avatar :color="'secondary'"> {{ item.value }} </v-avatar><br />
            <v-divider thickness="0px"></v-divider>
            {{ item.type }}
          </v-col>
        </v-row>
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
                v-if="allWorkouts.length > 0"
                v-bind:allWorkouts="allWorkouts"
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
    <!-- <v-card v-if="lastWorkout.name !== undefined">
      <v-card-title>
        <v-icon class="dumbbell-icon" color="secondary">mdi-history</v-icon>
        Last Workout
      </v-card-title>
      <v-card-subtitle>
        <div>{{ lastWorkout.name }}</div>
        <div>{{ lastWorkout.type + " - " + lastWorkout.time + " min" }}</div>
      </v-card-subtitle>
      <v-card-text v-html="lastWorkout.exercises.replaceAll('\n', '<br/>')">
      </v-card-text>
    </v-card> -->

    <v-card>
      <v-card-title> 
        <v-icon color="secondary">mdi-checkbox-marked-circle-outline</v-icon>
        Workouts this week 
      </v-card-title>
      <v-card-text>
        <v-timeline direction="horizontal" line-inset="8" truncate-line="both">
          <v-timeline-item
            v-for="(item, index) in timeline"
            size="x-small"
            :key="index"
            :dot-color="timeline[index].color"
          >
          <template v-if="index % 2 !== 0"> {{ item.day }} </template>
          <template v-if="index % 2 === 0" v-slot:opposite> {{ item.day }} </template>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>

    <PreviewList
      v-model="imported"
      v-if="imported && importedWorkouts.length > 0"
      v-bind:allWorkouts="importedWorkouts"
      v-bind:action="'import'"
      v-on:import-workouts="importWorkouts"
    ></PreviewList>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";
import PreviewList from "@/components/pop-ups/PreviewList.vue";
import QrcodeReader from "@/components/pop-ups/QrcodeReader.vue";

export default defineComponent({
  name: "AddWorkout",
  props: ["workoutSummary", "lastWorkout", "allWorkouts", "currentWorkout", "timeline"],

  components: {
    PreviewList,
    QrcodeReader,
  },

  data() {
    return {
      time: null,
      importedWorkouts: [],
      imported: false,
      snackbar: false,
      text: "",
      timeout: 2000,
    };
  },

  methods: {
    downloadedWorkouts(fileName) {
      this.text = fileName + " exported to Documents folder.";
      this.snackbar = true;
    },

    generateWorkout() {
      const validList =
        this.time !== null
          ? this.generateValidWorkoutsList()
          : [...this.allWorkouts];
      if (validList.length > 1) {
        let workout = {};
        do {
          workout = validList[Math.floor(Math.random() * validList.length)];
        } while (workout.id === this.currentWorkout.id);
        this.$emit("select-workout", workout);
        this.$router.push({ name: "workout-view" });
      } else if (validList.length === 1) {
        this.$emit("select-workout", validList[0]);
        this.$router.push({ name: "workout-view" });
      } else {
        //TODO show notification
        this.snackbar = true;
        this.text =
          "There is no workout with less than " + this.time + " minutes.";
      }
    },

    generateValidWorkoutsList() {
      let validList = [];
      for (const workout of this.allWorkouts) {
        if (workout.time <= this.time) validList = [...validList, workout];
      }
      return validList;
    },

    importWorkouts(workouts) {
      this.imported = false;
      this.$emit("import-workouts", workouts);
    },

    previewImportedWorkouts(workouts) {
      this.importedWorkouts = JSON.parse(workouts);
      this.imported = true;
    },
  },
});
</script>

<style>
.v-divider {
  margin-top: 5px;
  margin-bottom: 5px;
}
.divider {
  margin-top: 10px;
  margin-bottom: 10px;
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
</style>
