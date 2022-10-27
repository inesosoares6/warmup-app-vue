<template>
  <div>
    <v-app-bar app fixed dark color="primary">
      <v-toolbar-title>WOD App</v-toolbar-title>
      <v-btn>
        <v-icon>mdi-plus</v-icon>
        <AddWorkout v-on:add-workout="addWorkout"></AddWorkout>
      </v-btn>
      <v-btn>
        <v-icon>mdi-cog</v-icon>
        <SettingsMenu
          :allWorkouts="allWorkouts"
          v-on:delete-cache="deleteCache"
          v-on:delete-workouts="deleteWorkouts"
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
  props: ["allWorkouts"],

  components: {
    SettingsMenu,
    AddWorkout,
  },

  data() {
    return {};
  },

  methods: {
    addWorkout(newWorkout) {
      this.$emit("add-workout", newWorkout);
    },

    deleteCache() {
      this.$emit("delete-cache");
    },

    deleteWorkouts(workoutList) {
      this.$emit("delete-workouts", workoutList);
    },
  },
});
</script>

<style scoped></style>
