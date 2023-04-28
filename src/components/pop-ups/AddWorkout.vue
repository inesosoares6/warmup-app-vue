<template>
  <v-dialog v-model="addWorkout" activator="parent">
    <AddEditWorkoutForm
      :title="'Add'"
      :workout="{}"
      :buttonText="'Add'"
      v-on:submit-workout="submitWorkout"
    />
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import AddEditWorkoutForm from "@/components/shared/AddEditWorkoutForm.vue";
import { useStoreWorkouts } from "@/stores/storeWorkouts";

const storeWorkouts = useStoreWorkouts();
const addWorkout = ref(false);

const submitWorkout = (workout) => {
  addWorkout.value = false;
  storeWorkouts.addWorkout({
    id: uuidv4(),
    workout: workout,
  });
};
</script>

<style>
.v-card-title {
  margin-top: 10px;
}
</style>
