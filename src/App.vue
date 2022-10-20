<template>
  <v-app>
    <BottomToolbar></BottomToolbar>
    <TopToolbar v-on:add-workout="addWorkout"></TopToolbar>
    <v-main>
      <router-view></router-view>
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
      allWorkouts: []
    };
  },

  methods: {
    addWorkout(newWorkout) {
      this.allWorkouts = [...this.allWorkouts, newWorkout];
    },
  },

  watch: {
    allWorkouts: {
        handler() {
            console.log('allWorkouts array changed!');
            localStorage.setItem('allWorkouts', JSON.stringify(this.allWorkouts));
        },
        deep: true,
    },
},
};
</script>
