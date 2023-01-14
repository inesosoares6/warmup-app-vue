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
        <v-list class="preview-wod-list" lines="two" v-if="workouts.length > 0">
          <v-list-item
            v-for="(workout, index) in workouts"
            :key="workout.id"
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
        <v-btn
          v-if="action === 'delete'"
          color="error"
          :disabled="workoutList.length < 1"
          @click="deleteWorkouts"
        >
          Delete</v-btn
        >
        <v-btn
          v-else-if="action === 'export'"
          color="secondary"
          :disabled="workoutList.length < 1"
        >
          Generate
          <QrcodeGenerator
            v-if="workoutList.length > 0"
            :workoutList="workoutList"
            v-on:close-menu="downloadedWorkouts"
          />
        </v-btn>
        <v-btn
          v-else
          color="secondary"
          :disabled="workoutList.length < 1"
          @click="importWorkouts"
        >
          Import
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";
import QrcodeGenerator from "@/components/pop-ups/QrcodeGenerator.vue";
import { useStoreWorkouts } from "@/stores/storeWorkouts";

export default defineComponent({
  name: "PreviewList",
  props: ["workouts", "action"],

  setup() {
    const store = useStoreWorkouts();
    return {
      store,
    };
  },

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
    deleteWorkouts() {
      this.store.deleteWorkouts(this.workoutList);
      this.previewList = false;
    },

    downloadedWorkouts(fileName) {
      this.$emit("downloaded-workouts", fileName);
      this.previewList = false;
    },

    importWorkouts() {
      this.store.importWorkouts(this.workoutList);
      this.$router.push({ name: "all-view" });
    },

    updateCheckboxes(value) {
      this.selected = new Array(this.workouts.length).fill(value);
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
      this.workoutList = this.selectedAll ? [...this.workouts] : [];
    },
  },
});
</script>

<style scoped>
.preview-wod-list {
  max-height: 500px;
  overflow-y: auto;
}
</style>
