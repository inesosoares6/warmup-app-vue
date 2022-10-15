<template>
  <v-dialog v-model="previewWorkout" activator="parent">
    <v-card
        :title="workout.name"
        :subtitle="workout.type + ' - ' + workout.time + ' min'"
        :text="workout.exercises"
      >
      <v-card-actions>
        <v-spacer></v-spacer
        ><v-btn color="error" @click="deleteWorkout"> Delete </v-btn>
        <v-btn color="secondary" @click="selectWorkout"> Add </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PreviewWorkout",
  props: ["workout"],

  data() {
    return {
        previewWorkout: false,
    };
  },

  methods: {
    deleteWorkout() {
      console.log("delete", this.workout.name);
      this.previewWorkout = false;
    },
    selectWorkout() {
      console.log("select", this.workout.name);
      this.previewWorkout = false;
    },
  },
});
</script>
