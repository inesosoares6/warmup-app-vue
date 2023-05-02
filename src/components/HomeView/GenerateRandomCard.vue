<template>
  <v-card title="Generate Random">
      <template v-slot:prepend>
        <v-icon class="title-icon" color="secondary"
          >mdi-dumbbell</v-icon
        >
      </template>

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
</template>

<script setup>
import { ref, computed } from "vue";
import { useStoreWorkouts } from "@/stores/storeWorkouts";
import { useRouter } from "vue-router";

const storeWorkouts = useStoreWorkouts();
const router = useRouter();
const time = ref(null);

const emit = defineEmits(["show-snackbar"]);

const allWorkouts = computed(() => {
  return storeWorkouts.allWorkouts;
});

const generateWorkout = () => {
  const validList =
    time.value !== null
      ? generateValidWorkoutsList()
      : [...Object.keys(allWorkouts.value)];
  if (validList.length > 1) {
    storeWorkouts.selectWorkout(
      validList[Math.floor(Math.random() * validList.length)]
    );
    router.push({ name: "workout-view" });
  } else if (validList.length === 1) {
    storeWorkouts.selectWorkout(validList[0]);
    router.push({ name: "workout-view" });
  } else {
    emit("show-snackbar", {
      color: "error",
      text: "There is no workout with less than " + time.value + " minutes.",
    });
  }
};

const generateValidWorkoutsList = () => {
  let validList = [];
  Object.keys(allWorkouts.value).forEach((key) => {
    let workout = allWorkouts.value[key];
    if (workout.time <= time.value) validList = [...validList, key];
  });
  return validList;
};
</script>

<style scoped>
.go-btn {
  margin-top: 10px;
}

.v-text-field :deep(input::-webkit-outer-spin-button),
.v-text-field :deep(input::-webkit-inner-spin-button) {
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
}
</style>