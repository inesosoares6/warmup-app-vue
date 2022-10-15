<template>
  <v-list class="wod-list" lines="two">
    <v-list-item
      v-for="(workout, index) in workouts"
      :key="index"
      @click="selectWorkout(workout)"
      :title="workout.name"
      :subtitle="workout.type + ' - ' + workout.time + ' min'"
    >
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

export default defineComponent({
  name: "AllView",

  data() {
    return {
      workouts: [
        {
          name: "1",
          type: "WOD",
          time: 10,
          exercises: "teste teste teste",
          done: true,
        },
        {
          name: "2",
          type: "WOD",
          time: 10,
          exercises: "teste teste teste",
          done: false,
        },
        {
          name: "3",
          type: "WOD",
          time: 10,
          exercises: "teste teste teste",
          done: true,
        },
        {
          name: "4",
          type: "WOD",
          time: 10,
          exercises: "teste teste teste",
          done: false,
        },
        {
          name: "5",
          type: "WOD",
          time: 10,
          exercises: "teste teste teste",
          done: true,
        },
        {
          name: "6",
          type: "WOD",
          time: 10,
          exercises: "teste teste teste",
          done: false,
        },
        {
          name: "7",
          type: "WOD",
          time: 10,
          exercises: "teste teste teste",
          done: false,
        },
        {
          name: "8",
          type: "WOD",
          time: 10,
          exercises: "teste teste teste",
          done: false,
        },
        {
          name: "9",
          type: "WOD",
          time: 10,
          exercises: "teste teste teste",
          done: false,
        },
        {
          name: "10",
          type: "WOD",
          time: 10,
          exercises: "teste teste teste",
          done: false,
        },
      ],
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
