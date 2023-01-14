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
              {{ store.workoutSummary.done }} </v-avatar
            ><br />
            <v-divider thickness="0px"></v-divider>
            Done
          </v-col>
          <v-col class="done-todo">
            <v-avatar size="60" :color="'error'">
              {{ store.workoutSummary.todo }} </v-avatar
            ><br />
            <v-divider thickness="0px"></v-divider>
            To Do
          </v-col>
        </v-row>
        <v-divider class="divider" thickness="1px"></v-divider>
        <v-slide-group>
          <v-slide-group-item
            v-for="(item, index) in store.workoutSummary.types"
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
            v-for="(item, index) in store.timeline"
            size="x-small"
            :key="index"
            :dot-color="store.timeline[index].color"
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
                v-if="store.allWorkouts.length > 0"
                v-bind:workouts="store.allWorkouts"
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
        <v-btn :color="this.color" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";
import PreviewList from "@/components/pop-ups/PreviewList.vue";
import QrcodeReader from "@/components/pop-ups/QrcodeReader.vue";
import { useStoreWorkouts } from '@/stores/storeWorkouts';

export default defineComponent({
  name: "AddWorkout",

  components: {
    PreviewList,
    QrcodeReader,
  },

  setup() {
    const store = useStoreWorkouts()
    return {
      store,
    }
  },

  data() {
    return {
      time: null,
      importedWorkouts: [],
      imported: false,
      snackbar: false,
      color: "",
      text: "",
      timeout: 2000,
      showWorkoutDone: false,
      selectedDay: "",
    };
  },

  methods: {
    downloadedWorkouts(fileName) {
      if (fileName !== "") {
        this.text = fileName + " exported to Documents folder.";
        this.snackbar = true;
        this.color = "secondary";
      }
    },

    generateWorkout() {
      const validList =
        this.time !== null
          ? this.generateValidWorkoutsList()
          : [...this.store.allWorkouts];
      if (validList.length > 1) {
        let workout = {};
        do {
          workout = validList[Math.floor(Math.random() * validList.length)];
        } while (workout.id === this.store.currentWorkout.id);
        this.store.selectWorkout(workout);
        this.$router.push({ name: "workout-view" });
      } else if (validList.length === 1) {
        this.store.selectWorkout(validList[0]);
        this.$router.push({ name: "workout-view" });
      } else {
        this.snackbar = true;
        this.color = "error";
        this.text =
          "There is no workout with less than " + this.time + " minutes.";
      }
    },

    generateValidWorkoutsList() {
      let validList = [];
      for (const workout of this.store.allWorkouts) {
        if (workout.time <= this.time) validList = [...validList, workout];
      }
      return validList;
    },

    getDay(day) {
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
    },

    getWorkoutsDone() {
      let workoutsList = [];
      this.selectedDay.workoutsId.forEach((id) => {
        workoutsList.push(this.store.allWorkouts.find((e) => e.id === id));
      });
      return workoutsList;
    },

    importWorkouts(workouts) {
      this.imported = false;
      this.store.importWorkouts(workouts);
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
