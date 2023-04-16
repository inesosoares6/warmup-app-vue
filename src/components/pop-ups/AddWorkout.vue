<template>
  <v-dialog v-model="addWorkout" activator="parent">
    <v-card>
      <v-card-title> Add Workout </v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="valid" lazy-validation>
          <v-text-field
            v-model="name"
            :rules="[(v) => !!v || 'Name is required']"
            label="Name"
            required
          ></v-text-field>
          <v-select
            v-model="type"
            :items="storeWorkouts.getTypes"
            :rules="[(v) => !!v || 'Item is required']"
            label="Type"
            required
          ></v-select>
          <v-text-field
            v-if="type === '--> Add new type'"
            v-model="newType"
            :rules="[(v) => !!v || 'Type is required']"
            label="New type"
            required
          ></v-text-field>
          <v-text-field
            v-model="time"
            type="number"
            :rules="[
              (v) => !!v || 'Field is required',
              (v) => v >= 0 || 'Time must be greater than 0',
            ]"
            label="Time (min)"
            required
          ></v-text-field>
          <v-textarea
            v-model="exercises"
            :rules="[(v) => !!v || 'Exercises are required']"
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

<script setup>
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useStoreWorkouts } from "@/stores/storeWorkouts";

const storeWorkouts = useStoreWorkouts();

const addWorkout = ref(false);
const valid = ref(true);
const name = ref("");
const type = ref("");
const time = ref(0);
const alreadyDone = ref(false);
const exercises = ref("");
const newType = ref("");
const formRef = ref(null);

const addWorkoutFunction = () => {
  formRef.value.validate();
  if (valid.value) {
    addWorkout.value = false;
    storeWorkouts.addWorkout({
      id: uuidv4(),
      workout: {
        name: name.value,
        type: type.value === "--> Add new type" ? newType.value : type.value,
        time: time.value,
        exercises: exercises.value,
        completions: alreadyDone.value ? 1 : 0,
      },
    });
    resetForm();
  }
};

const resetForm = () => {
  formRef.value.reset();
};
</script>

<style>
.v-card-title {
  margin-top: 10px;
}
</style>
