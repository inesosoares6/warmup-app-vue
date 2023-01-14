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
            :items="store.types"
            :rules="[(v) => !!v || 'Item is required']"
            label="Type"
            required
          ></v-select>
          <v-text-field
            v-if="type === '--> Add new type'"
            v-model="newType"
            :rules="nameRules"
            label="New type"
            required
          ></v-text-field>
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
        <v-spacer></v-spacer
        ><v-btn color="error" @click="resetForm"> Reset </v-btn>
        <v-btn color="secondary" @click="addWorkoutFunction"> Add </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useStoreWorkouts } from "@/stores/storeWorkouts";

export default defineComponent({
  name: "AddWorkout",

  setup() {
    const store = useStoreWorkouts();
    return {
      store,
    };
  },

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
      newType: "",
    };
  },

  methods: {
    addWorkoutFunction() {
      this.$refs.form.validate();
      if (this.valid) {
        this.addWorkout = false;
        this.store.addWorkout({
          id: uuidv4(),
          name: this.name,
          type: this.type === "--> Add new type" ? this.newType : this.type,
          time: this.time,
          exercises: this.exercises,
          completions: this.alreadyDone ? 1 : 0,
        });
        this.resetForm();
      }
    },
    resetForm() {
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
