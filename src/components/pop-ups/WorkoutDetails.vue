<template>
  <v-dialog v-model="workoutDetails" activator="parent">
    <v-card
      title="Workout Details"
      :subtitle="
        workout.name + ': ' + workout.type + ' - ' + workout.time + ' min'
      "
    >
      <template v-slot:append>
        <v-btn v-if="!addDetails" icon color="#424242" @click="addDetails = true">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn v-else icon color="#424242" @click="addDetails = false">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
      </template>
      <v-card-text v-if="workout.details !== undefined">
        {{ workout.details }}
      </v-card-text>
      <v-card-text v-else-if="!addDetails">
        Click on the add button to add details to this workout.
      </v-card-text>
      <v-card-text v-if="addDetails">
        <v-textarea label="Details" v-model="details" hide-details></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="details !== '' && addDetails"
          color="secondary"
          @click="saveDetails"
        >
          Save
        </v-btn>
        <v-btn v-else color="error" @click="workoutDetails = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "WorkoutDetails",
  props: ["workout"],

  data() {
    return {
      workoutDetails: false,
      addDetails: false,
      details: "",
      currentWorkout: null,
    };
  },

  mounted() {
    this.currentWorkout = this.workout;
  },

  methods: {
    saveDetails() {
      this.currentWorkout.details = this.details;
      this.$emit("edited-workout", this.currentWorkout);
      this.addDetails = false;
      this.workoutDetails = false;
    },
  },
});
</script>
