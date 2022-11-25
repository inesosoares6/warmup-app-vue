<template>
  <div>
    <v-app-bar app fixed dark color="primary">
      <v-toolbar-title>WOD App</v-toolbar-title>
      <v-btn>
        <v-icon>mdi-plus</v-icon>
        <AddWorkout v-on:add-workout="addWorkout" :types="types"></AddWorkout>
      </v-btn>
      <v-btn>
        <v-icon>mdi-cog</v-icon>
        <SettingsMenu
          :allWorkouts="allWorkouts"
          :groupByType="groupByType"
          :personalRecords="personalRecords"
          :theme="theme"
          :measurements="measurements"
          v-on:delete-cache="deleteCache"
          v-on:delete-workouts="deleteWorkouts"
          v-on:group-by-types="groupByTypeFunction"
          v-on:delete-personal-records="deletePRs"
          v-on:toggle-theme="toggleTheme"
          v-on:delete-measurements="deleteMeasurements"
        ></SettingsMenu>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import SettingsMenu from "./pop-ups/SettingsMenu.vue";
import AddWorkout from "./pop-ups/AddWorkout.vue";

export default defineComponent({
  name: "TopToolbar",
  props: [
    "allWorkouts",
    "groupByType",
    "types",
    "personalRecords",
    "theme",
    "measurements",
  ],

  components: {
    SettingsMenu,
    AddWorkout,
  },

  methods: {
    addWorkout(newWorkout) {
      this.$emit("add-workout", newWorkout);
    },

    deleteCache() {
      this.$emit("delete-cache");
    },

    deleteMeasurements(records) {
      this.$emit("delete-measurements", records);
    },

    deletePRs(records) {
      this.$emit("delete-personal-records", records);
    },

    deleteWorkouts(workoutList) {
      this.$emit("delete-workouts", workoutList);
    },

    groupByTypeFunction(value) {
      this.$emit("group-by-types", value);
    },

    toggleTheme() {
      this.$emit("toggle-theme");
    },
  },
});
</script>

<style scoped></style>
