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
          <v-text-field
            v-model="exercises"
            :rules="nameRules"
            label="Exercises"
            required
          ></v-text-field>
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
        //TODO add workout
        this.addWorkout = false;
        console.log({
          name: this.name,
          type: this.type,
          time: this.time,
          exercises: this.exercises,
          done: this.alreadyDone,
        });
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