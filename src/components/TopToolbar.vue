<template>
  <div>
    <v-app-bar app fixed dark color="primary">
      <v-toolbar-title>WOD App</v-toolbar-title>
      <v-btn>
        <v-icon>mdi-plus</v-icon>
        <AddWorkout
          v-on:add-workout="addWorkout"
          :types="getTypes()"
        ></AddWorkout>
      </v-btn>
      <v-btn>
        <v-icon>mdi-cog</v-icon>
        <SettingsMenu
          :allWorkouts="allWorkouts"
          :groupByType="groupByType"
          v-on:delete-cache="deleteCache"
          v-on:delete-workouts="deleteWorkouts"
          v-on:group-by-types="groupByTypeFunction"
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
  props: ["allWorkouts", "groupByType"],

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

    getTypes() {
      let types = [];
      this.allWorkouts.forEach((element) => {
        if (!types.some((e) => e === element.type)) {
          types.push(element.type);
        }
      });
      types.push("Other");
      return types;
    },

    groupByTypeFunction(value) {
      this.$emit("group-by-types", value);
    },
  },
});
</script>

<style scoped></style>
