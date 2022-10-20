<template>
  <v-app>
    <BottomToolbar></BottomToolbar>
    <TopToolbar v-on:add-workout="addWorkout"></TopToolbar>
    <v-main>
      <router-view v-slot="{ Component, route }">
        <component
          :is="Component"
          :key="route.path"
          :allWorkouts="allWorkouts"
          v-on:deleteWorkout="deleteWorkout"
        />
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
import TopToolbar from "./components/TopToolbar.vue";
import BottomToolbar from "./components/BottomToolbar.vue";

export default {
  name: "App",

  components: {
    TopToolbar,
    BottomToolbar,
  },

  data() {
    return {
      allWorkouts: [],
    };
  },

  mounted() {
    if (localStorage.getItem("allWorkouts"))
      this.allWorkouts = JSON.parse(localStorage.getItem("allWorkouts"));
  },

  methods: {
    addWorkout(newWorkout) {
      this.allWorkouts = [...this.allWorkouts, newWorkout];
    },
    
    deleteWorkout(id) {
      this.allWorkouts = this.allWorkouts.filter(
        (workout) => workout.id !== id
      );
    },
  },

  watch: {
    allWorkouts: {
      handler() {
        localStorage.setItem("allWorkouts", JSON.stringify(this.allWorkouts));
      },
      deep: true,
    },
  },
};
</script>
