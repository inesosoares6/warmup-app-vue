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

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import QrcodeGenerator from "@/components/pop-ups/QrcodeGenerator.vue";
import { useStoreWorkouts } from "@/stores/storeWorkouts";

const storeWorkouts = useStoreWorkouts();
const router = useRouter();
const emit = defineEmits(["downloaded-workouts"]);
const props = defineProps({
  workouts: {
    type: Array,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
});

const previewList = ref(false);
const selected = ref([]);
const selectedAll = ref(false);
const workoutList = ref([]);

onMounted(() => {
  updateCheckboxes(false);
});

const downloadedWorkouts = (fileName) => {
  emit("downloaded-workouts", fileName);
  previewList.value = false;
};

const importWorkouts = () => {
  storeWorkouts.importWorkouts(workoutList.value);
  router.push({ name: "all-view" });
};

const updateCheckboxes = (value) => {
  selected.value = new Array(props.workouts.length).fill(value);
};

const updateList = (insert, newWorkout) => {
  if (insert !== false) {
    workoutList.value = [...workoutList.value, newWorkout];
    if (selected.value.every((v) => v === true)) {
      selectedAll.value = true;
    }
  } else {
    workoutList.value = workoutList.value.filter(
      (workout) => workout.id !== newWorkout.id
    );
    selectedAll.value = false;
  }
};

const updateListAll = () => {
  updateCheckboxes(selectedAll.value);
  workoutList.value = selectedAll.value ? [...props.workouts] : [];
};
</script>

<style scoped>
.preview-wod-list {
  max-height: 500px;
  overflow-y: auto;
}
</style>
