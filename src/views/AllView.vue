<template>
  <v-container>
    <v-list class="wod-list" lines="two" v-if="allWorkouts.length > 0">
      <v-list-item
        v-for="(workout, index) in allWorkouts"
        :key="workout.id"
        :title="workout.name"
        :subtitle="workout.type + ' - ' + workout.time + ' min'"
      >
        <PreviewWorkout
          :workout="workout"
          v-on:delete-workout="deleteWorkout(index)"
          v-on:edit-workout="editWorkout"
          v-on:select-workout="selectWorkout"
        ></PreviewWorkout>

        <template v-slot:prepend>
          <v-avatar :color="workout.completions > 0 ? 'secondary' : 'error'">
            <v-icon>mdi-dumbbell</v-icon>
          </v-avatar>
        </template>
        <template v-slot:append>
          <v-avatar outline color="grey">
            {{ workout.completions }}
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";
import PreviewWorkout from "@/components/pop-ups/PreviewWorkout.vue";

export default defineComponent({
  name: "AllView",
  props: ["allWorkouts"],

  components: {
    PreviewWorkout,
  },

  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
    };
  },

  created() {
    this.snackbar = this.allWorkouts.length < 1;
    this.text = "Add workouts";
  },

  methods: {
    deleteWorkout(index) {
      this.$emit("delete-workout", index);
    },

    editWorkout(workout) {
      this.$emit("edit-workout", workout);
    },

    selectWorkout(workout) {
      this.$emit("select-workout", workout);
    },
  },
});
</script>
