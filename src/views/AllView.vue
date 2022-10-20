<template>
  <v-list class="wod-list" lines="two" v-if="workouts.length > 0">
    <v-list-item
      v-for="(workout, index) in workouts"
      :key="index"
      @click="selectWorkout(workout)"
      :title="workout.name"
      :subtitle="workout.type + ' - ' + workout.time + ' min'"
    >
      <PreviewWorkout :workout="workout"></PreviewWorkout>

      <template v-slot:prepend>
        <v-avatar :color="workout.done ? 'secondary' : 'error'">
          <v-icon>mdi-dumbbell</v-icon>
        </v-avatar>
      </template>
    </v-list-item>
  </v-list>
</template>

<script>
import { defineComponent } from "vue";
import PreviewWorkout from "@/components/pop-ups/PreviewWorkout.vue";

export default defineComponent({
  name: "AllView",

  components: {
    PreviewWorkout,
  },

  mounted() {
    console.log("Mounted");
    if (localStorage.getItem("allWorkouts"))
      this.workouts = JSON.parse(localStorage.getItem("allWorkouts"));
    console.log(this.workouts);
  },

  data() {
    return {
      workouts: [],
    };
  },

  methods: {
    selectWorkout(workout) {
      //TODO set dark mode
      console.log(workout);
    },
  },
});
</script>
