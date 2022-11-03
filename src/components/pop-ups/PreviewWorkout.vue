<template>
  <v-dialog v-model="previewWorkout" activator="parent">
    <v-card
      :title="workout.name"
      :subtitle="workout.type + ' - ' + workout.time + ' min'"
    >
      <template v-slot:append>
        <v-btn icon color="grey">
          <v-icon>mdi-pencil</v-icon>
          <EditWorkout
            v-bind:workout="workout"
            v-bind:types="types"
            v-on:edit-workout="editWorkout"
          />
        </v-btn>
      </template>
      <v-card-text v-html="workout.exercises.replaceAll('\n', '<br/>')">
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          @click="selectWorkout"
          :to="{ name: 'workout-view' }"
        >
          Select
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";
import EditWorkout from "@/components/pop-ups/EditWorkout.vue";

export default defineComponent({
  name: "PreviewWorkout",
  props: ["workout", "types"],

  components: {
    EditWorkout,
  },

  data() {
    return {
      previewWorkout: false,
    };
  },

  methods: {
    editWorkout(workout) {
      this.$emit("edit-workout", workout);
    },

    selectWorkout() {
      this.$emit("select-workout", this.workout);
      this.previewWorkout = false;
    },
  },
});
</script>
