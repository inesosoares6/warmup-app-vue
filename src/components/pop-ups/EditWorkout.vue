<template>
  <v-dialog v-model="editWorkout" activator="parent">
    <v-card>
      <v-card-title> Edit Workout </v-card-title>
      <v-card-text>
        <v-form ref="formEditRef">
          <v-text-field
            v-model="workoutEdited.name"
            :rules="[(v) => !!v || 'Name is required']"
            label="Name"
            required
          ></v-text-field>
          <v-select
            v-model="workoutEdited.type"
            :items="storeWorkouts.getTypes"
            :rules="[(v) => !!v || 'Type is required']"
            label="Type"
            required
            hide-details
          ></v-select>
          <v-text-field
            v-if="workoutEdited.type === '--> Add new type'"
            v-model="newType"
            :rules="nameRules"
            label="New type"
            required
          ></v-text-field>
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
            :rules="[(v) => !!v || 'Exercises are required']"
            label="Exercises"
            required
            hide-details
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer
        ><v-btn color="error" @click="resetForm"> Reset </v-btn>
        <v-btn color="secondary" @click="updateWorkout"> Update </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useStoreWorkouts } from "@/stores/storeWorkouts";
import { onMounted } from "vue";

const props = defineProps({
  workout: {
    type: Object,
    required: true,
  }
});

const storeWorkouts = useStoreWorkouts();

const editWorkout = ref(false);
const timeRules = ref([
  (v) => !!v || "Field is required",
  (v) => v >= 0 || "Time must be greater than 0",
]);
const workoutEdited = ref({});
const newType = ref("");

onMounted(() => {
  workoutEdited.value = { ...props.workout };
});

const updateWorkout = () => {
  editWorkout.value = false;
  if (workoutEdited.value.type === "--> Add new type") {
    workoutEdited.value.type = newType.value;
  }
  storeWorkouts.editWorkout(workoutEdited.value);
};

const formEditRef = ref(null);
const resetForm = () => {
  formEditRef.value.reset();
};
</script>

<style>
.v-card-title {
  margin-top: 10px;
}
</style>
