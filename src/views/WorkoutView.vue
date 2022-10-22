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
    <v-card
      v-if="currentWorkout.name !== undefined"
      :title="currentWorkout.name"
      :subtitle="currentWorkout.type + ' - ' + currentWorkout.time + ' min'"
    >
      <v-card-text v-html="currentWorkout.exercises.replaceAll('\n', '<br/>')">
      </v-card-text>
    </v-card>

    <v-snackbar class="d-flex justify-center" v-model="snackbar" :timeout="timeout">
      {{ text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "WorkoutView",
  props: ["currentWorkout"],

  data() {
    return {
      checkbox: false,
      snackbar: false,
      text: "",
      timeout: 2000,
    };
  },

  created() {
    this.snackbar = this.currentWorkout.name === undefined;
    this.text = 'No workout selected';
  },

  methods: {
    updateWorkout() {
      if (this.checkbox) this.$emit("update-workout", this.currentWorkout);
    },
  },
});
</script>
