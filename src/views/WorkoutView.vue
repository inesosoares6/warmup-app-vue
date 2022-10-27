<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="headline">Workout</h1>
      </v-col>
      <v-col>
        <v-checkbox
          v-if="currentWorkout.name !== undefined"
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
    <v-col class="text-right">
      <v-btn
        v-if="currentWorkout.name !== undefined"
        class="floating-button"
        color="secondary"
        icon
        @click="copyWorkout"
      >
        <v-icon>mdi-content-copy</v-icon>
      </v-btn>
    </v-col>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";
import { Clipboard } from "@capacitor/clipboard";

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
    this.text = "No workout selected";
  },

  methods: {
    copyWorkout() {
      // navigator.clipboard
      //   .writeText(this.createStringWorkout())
      //   .then(() => {
      //     alert("successfully copied");
      //   })
      //   .catch((error) => {
      //     alert(error);
      //   });
      Clipboard.write({
        string: this.createStringWorkout(),
      });
      this.snackbar = true;
      this.text = "Copied workout to clipboard";
    },

    createStringWorkout() {
      return (
        this.currentWorkout.name +
        "\n" +
        this.currentWorkout.type +
        " - " +
        this.currentWorkout.time +
        " min" +
        "\n-------------\n" +
        this.currentWorkout.exercises
      );
    },

    updateWorkout() {
      if (this.checkbox) this.$emit("update-workout", this.currentWorkout);
    },
  },
});
</script>

<style>
.floating-button {
  position: absolute;
  bottom: 70px;
  right: 10px;
}
</style>
