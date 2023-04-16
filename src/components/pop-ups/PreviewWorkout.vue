<template>
  <v-dialog v-model="previewWorkout" activator="parent">
    <v-card
      :title="workout.name"
      :subtitle="workout.type + ' - ' + workout.time + ' min'"
    >
      <template v-slot:prepend>
        <v-icon size="small" color="secondary">mdi-weight-lifter</v-icon>
      </template>
      <template v-slot:append>
        <v-btn icon color="grey">
          <v-icon>mdi-pencil</v-icon>
          <EditWorkout v-bind:workout="workout" v-bind:id="id" />
        </v-btn>
      </template>
      <v-card-text v-html="workout.exercises.replaceAll('\n', '<br/>')">
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="deleteWorkout"> Delete </v-btn>
        <v-btn
          color="secondary"
          @click="selectWorkout"
          :to="{ name: 'workout-view' }"
        >
          Select
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import EditWorkout from "@/components/pop-ups/EditWorkout.vue";
import { useStoreWorkouts } from "@/stores/storeWorkouts";

const props = defineProps(["workout", "id"]);

const storeWorkouts = useStoreWorkouts();
const previewWorkout = ref(false);

const deleteWorkout = () => {
  storeWorkouts.deleteWorkout(props.id);
  previewWorkout.value = false;
};

const selectWorkout = () => {
  storeWorkouts.selectWorkout(props.id);
  previewWorkout.value = false;
};
</script>
