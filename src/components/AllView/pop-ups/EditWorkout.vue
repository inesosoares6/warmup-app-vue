<template>
  <v-dialog v-model="editWorkout" activator="parent">
    <AddEditWorkoutForm
      :title="'Edit'"
      :workout="workout"
      :buttonText="'Update'"
      v-on:submit-workout="updateWorkout"
    />
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import AddEditWorkoutForm from "@/components/shared/AddEditWorkoutForm.vue";
import { useStoreWorkouts } from "@/stores/storeWorkouts";

const props = defineProps(["workout", "id"]);
const storeWorkouts = useStoreWorkouts();
const editWorkout = ref(false);

const updateWorkout = (workout) => {
  editWorkout.value = false;
  storeWorkouts.updateWorkout({
    id: props.id,
    updates: workout,
  });
};
</script>

<style>
.v-card-title {
  margin-top: 10px;
}
</style>
