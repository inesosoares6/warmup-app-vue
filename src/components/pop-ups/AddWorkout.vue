<template>
  <v-dialog v-model="addWorkout" activator="parent">
    <v-card>
      <v-card-title> Add Workout </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="name"
            :rules="nameRules"
            label="Name"
            required
          ></v-text-field>
          <v-select
            v-model="type"
            :items="types"
            :rules="[(v) => !!v || 'Item is required']"
            label="Type"
            required
          ></v-select>
          <v-text-field
            v-model="time"
            type="number"
            :rules="timeRules"
            label="Time (min)"
            required
          ></v-text-field>
          <v-textarea
            v-model="exercises"
            :rules="nameRules"
            label="Exercises"
            required
            hide-details
          ></v-textarea>
          <v-checkbox
            v-model="alreadyDone"
            label="Already done"
            hide-details
          ></v-checkbox>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer><v-btn color="error" @click="reset"> Reset </v-btn>
        <v-btn color="secondary" @click="validate"> Add </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { v4 as uuidv4 } from 'uuid';

export default defineComponent({
  name: "AddWorkout",

  data() {
    return {
      addWorkout: false,
      valid: true,
      name: "",
      type: "",
      time: 0,
      alreadyDone: false,
      exercises: "",
      nameRules: [(v) => !!v || "Field is required"],
      timeRules: [
        (v) => !!v || "Field is required",
        (v) => v >= 0 || "Time must be greater than 0",
      ],
      types: ["WOD", "AFAP", "AMRAP", "EMOM"],
    };
  },

  methods: {
    validate() {
      this.$refs.form.validate();
      if (this.valid) {
        this.addWorkout = false;
        const newWorkout = {
          id: uuidv4(),
          name: this.name,
          type: this.type,
          time: this.time,
          exercises: this.exercises,
          completions: this.alreadyDone ? 1 : 0,
        };
        this.$emit('add-workout', newWorkout);
        this.reset();
      }
    },
    reset() {
      this.$refs.form.reset();
    },
  },
});
</script>

<style>
.v-card-title {
  margin-top: 10px;
}
</style>