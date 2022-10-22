<template>
  <v-dialog v-model="previewList" activator="parent">
    <v-card title="Select Workouts">
      <template v-slot:append>
        <v-checkbox
          v-model="selectedAll"
          hide-details
          @change="updateListAll()"
        ></v-checkbox>
      </template>
      <v-card-text>
        <v-list class="wod-list" lines="two" v-if="allWorkouts.length > 0">
          <v-list-item
            v-for="(workout, index) in allWorkouts"
            :key="index"
            :title="workout.name"
            :subtitle="workout.type + ' - ' + workout.time + ' min'"
          >
            <template v-slot:prepend>
              <v-avatar
                :color="workout.completions > 0 ? 'secondary' : 'error'"
              >
                <v-icon>mdi-dumbbell</v-icon>
              </v-avatar>
            </template>
            <template v-slot:append>
              <v-checkbox
                v-model="selected[index]"
                hide-details
                @change="updateList(selected[index], workout)"
              ></v-checkbox>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="exportWorkouts" color="secondary">
          Generate QR Code
          <QrcodeGenerator :message="JSON.stringify(workoutList)" />
        </v-btn>
        <v-btn v-else color="secondary" @click="importWorkoutsFunction">
          Import
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";
import QrcodeGenerator from "@/components/pop-ups/QrcodeGenerator.vue";

export default defineComponent({
  name: "PreviewList",
  props: ["allWorkouts", "exportWorkouts"],

  components: {
    QrcodeGenerator,
  },

  created() {
    this.updateCheckboxes(false);
  },

  data() {
    return {
      previewList: false,
      selected: [],
      selectedAll: false,
      workoutList: [],
    };
  },

  methods: {
    importWorkoutsFunction() {
      this.$emit("import-workouts", this.workoutList);
      this.previewList = false;
    },

    updateCheckboxes(value) {
      this.selected = new Array(this.allWorkouts.length).fill(value);
    },

    updateList(insert, newWorkout) {
      if (insert !== false) {
        this.workoutList = [...this.workoutList, newWorkout];
        if (this.selected.every((v) => v === true)) {
          this.selectedAll = true;
        }
      } else {
        this.workoutList = this.workoutList.filter(
          (workout) => workout.id !== newWorkout.id
        );
        this.selectedAll = false;
      }
    },

    updateListAll() {
      this.updateCheckboxes(this.selectedAll);
      this.workoutList = this.selectedAll ? [...this.allWorkouts] : [];
    },
  },
});
</script>
