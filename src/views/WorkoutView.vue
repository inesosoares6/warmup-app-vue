<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="headline">Workout</h1>
      </v-col>
      <v-col>
        <v-checkbox
          v-model="checkbox"
          label="Mark as done"
          hide-details
          @change="updateWorkout"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-card>
      <v-card-title>
        {{ workout.name }}
      </v-card-title>
      <v-card-subtitle>
        {{ workout.type + " - " + workout.time + " min" }}
      </v-card-subtitle>
      <v-card-text>
        {{ workout.exercises }}
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "WorkoutView",

  data() {
    return {
      checkbox: false,
      workout: {},
    };
  },

  mounted() {
    if (localStorage.getItem("currentWorkout"))
      this.workout = JSON.parse(localStorage.getItem("currentWorkout"));
  },

  methods: {
    updateWorkout() {
      //TODO update workout
      console.log("update", this.workout);
    },
  },
});
</script>
