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
        :deleteWorkout="deleteWorkout"
      ></PreviewWorkout>

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

  props: ["allWorkouts"],

  methods: {
    deleteWorkout(id) {
      this.$emit('deleteWorkout', id);
    },
  },
});
</script>
