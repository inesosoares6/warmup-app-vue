<template>
  <v-dialog v-model="previewList" activator="parent">
    <v-card title="Select Workouts">
      <template v-slot:append>
        <v-checkbox
          v-model="selectedAll"
          hide-details
          @change="updateCheckboxes(selectedAll)"
        ></v-checkbox>
      </template>
      <v-card-text>
        <v-list
          class="preview-wod-list"
          lines="two"
          v-if="Object.keys(workouts).length > 0"
        >
          <v-list-item
            v-for="(workout, key) in workouts"
            :key="key"
            :value="workout"
            rounded="xl"
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
                v-model="selected[key]"
                hide-details
                @change="updateMainCheckbox()"
              ></v-checkbox>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="action === 'export'"
          color="secondary"
          :disabled="Object.keys(getWorkouts).length < 1"
        >
          Generate
          <QrcodeGenerator
            v-if="Object.keys(getWorkouts).length > 0"
            :workoutList="Object.values(getWorkouts)"
            v-on:close-menu="downloadedWorkouts"
          />
        </v-btn>
        <v-btn
          v-else
          color="secondary"
          :disabled="Object.keys(getWorkouts).length < 1"
          @click="importWorkouts"
        >
          Import
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import QrcodeGenerator from "@/components/HomeView/pop-ups/QrcodeGenerator.vue";
import { useStoreWorkouts } from "@/stores/storeWorkouts";

const storeWorkouts = useStoreWorkouts();
const router = useRouter();
const emit = defineEmits(["downloaded-workouts"]);
const props = defineProps(["workouts", "action"]);

const previewList = ref(false);
const selected = ref([]);
const selectedAll = ref(false);

onMounted(() => {
  updateCheckboxes(false);
});

const getWorkouts = computed(() => {
  let workoutList = {};
  Object.keys(selected.value).forEach((key) => {
    if (selected.value[key]) workoutList[key] = props.workouts[key];
  });
  return workoutList;
});

const downloadedWorkouts = (fileName) => {
  emit("downloaded-workouts", fileName);
  previewList.value = false;
};

const importWorkouts = () => {
  storeWorkouts.importWorkouts(getWorkouts);
  router.push({ name: "all-view" });
};

const updateCheckboxes = (value) => {
  Object.keys(props.workouts).forEach((key) => {
    selected.value[key] = value;
  });
};

const updateMainCheckbox = () => {
  selectedAll.value = Object.values(selected.value).every((v) => v === true);
};
</script>

<style scoped>
.preview-wod-list {
  max-height: 500px;
  overflow-y: auto;
}
</style>
