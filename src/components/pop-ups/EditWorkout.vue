<template>
  <v-dialog v-model="editWorkout" activator="parent">
    <v-card>
      <v-card-title> Edit Workout </v-card-title>
      <v-card-text>
        <v-form ref="formEdit" v-model="valid" lazy-validation>
          <v-text-field
            v-model="workoutEdited.name"
            :rules="nameRules"
            label="Name"
            required
          ></v-text-field>
          <v-select
            v-model="workoutEdited.type"
            :items="types"
            :rules="[(v) => !!v || 'Item is required']"
            label="Type"
            required
          ></v-select>
          <v-row
            ><v-col>
              <v-text-field
                v-model="workoutEdited.time"
                type="number"
                :rules="timeRules"
                label="Time (min)"
                required
              ></v-text-field> </v-col
            ><v-col>
              <v-text-field
                v-model="workoutEdited.completions"
                type="number"
                label="Completions"
                required
              ></v-text-field> </v-col
          ></v-row>
          <v-textarea
            v-model="workoutEdited.exercises"
            :rules="nameRules"
            label="Exercises"
            required
            hide-details
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer><v-btn color="error" @click="resetForm"> Reset </v-btn>
        <v-btn color="secondary" @click="updateWorkout"> Update </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EditWorkout",
  props: ["workout"],

  mounted() {
    this.workoutEdited = { ...this.workout };
  },

  data() {
    return {
      editWorkout: false,
      valid: true,
      nameRules: [(v) => !!v || "Field is required"],
      timeRules: [
        (v) => !!v || "Field is required",
        (v) => v >= 0 || "Time must be greater than 0",
      ],
      types: ["WOD", "AFAP", "AMRAP", "EMOM"],
      workoutEdited: {},
    };
  },

  methods: {
    updateWorkout() {
      this.$refs.formEdit.validate();
      if (this.valid) {
        this.editWorkout = false;
        this.$emit("edit-workout", this.workoutEdited);
      }
    },
    resetForm() {
      this.$refs.formEdit.reset();
    },
  },
});
</script>

<style>
.v-card-title {
  margin-top: 10px;
}
</style>
