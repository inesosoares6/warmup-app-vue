<template>
  <v-list class="wod-list" lines="two" v-if="allWorkouts.length > 0">
    <v-list-item
      v-for="(workout, index) in allWorkouts"
      :key="index"
      :title="workout.name"
      :subtitle="workout.type + ' - ' + workout.time + ' min'"
    >
      <PreviewWorkout
        :workout="workout"
        v-on:delete-workout="deleteWorkout"
      ></PreviewWorkout>

      <template v-slot:prepend>
        <v-avatar :color="workout.completions > 0 ? 'secondary' : 'error'">
          <v-icon>mdi-dumbbell</v-icon>
        </v-avatar>
      </template>
      <template v-slot:append>
        <v-avatar outline color="grey">
          {{workout.completions}}
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

  props: ["allWorkouts"],

  methods: {
    deleteWorkout(id) {
      this.$emit("delete-workout", id);
    },
  },
});
</script>
