<template>
  <v-card>
    <v-card-title> {{ title }} Workout </v-card-title>
    <v-card-text>
      <v-form ref="formRef" v-model="valid" lazy-validation>
        <v-text-field
          v-model="workoutEdited.name"
          label="Name"
          :rules="[(v) => !!v || 'Required']"
          required
        ></v-text-field>
        <v-select
          v-model="workoutEdited.type"
          :items="types"
          :rules="[(v) => !!v || 'Required']"
          label="Type"
          required
        ></v-select>
        <v-text-field
          v-if="workoutEdited.type === '--> Add new type'"
          v-model="newType"
          :rules="[(v) => !!v || 'Required']"
          label="New type"
          required
        ></v-text-field>
        <v-row
          ><v-col>
            <v-text-field
              v-model="workoutEdited.time"
              :rules="[
                (v) => v != null || 'Required',
                (v) => v >= 0 || 'Must be >= 0',
              ]"
              type="number"
              label="Time (min)"
              required
            ></v-text-field> </v-col
          ><v-col>
            <v-text-field
              v-model="workoutEdited.completions"
              type="number"
              :rules="[
                (v) => v!= null || 'Required',
                (v) => v >= 0 || 'Must be >= 0',
              ]"
              label="Completions"
              required
            ></v-text-field> </v-col
        ></v-row>
        <v-textarea
          v-model="workoutEdited.exercises"
          :rules="[(v) => !!v || 'Required']"
          label="Exercises"
          required
          hide-details
        ></v-textarea>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer
      ><v-btn color="error" @click="resetForm"> Reset </v-btn>
      <v-btn color="secondary" @click="submitWorkout"> {{ buttonText }} </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStoreWorkouts } from "@/stores/storeWorkouts";

const storeWorkouts = useStoreWorkouts();

const props = defineProps(["title", "workout", "buttonText"]);
const emit = defineEmits(["submit-workout"]);

const workoutEdited = ref({});
const newType = ref("");
const valid = ref(true);
const formRef = ref(null);

const types = computed(() => {
  return [...storeWorkouts.getTypes, "--> Add new type"];
});

onMounted(() => {
  workoutEdited.value = { ...props.workout };
});

const submitWorkout = () => {
  formRef.value.validate();
  if (valid.value) {
    if (workoutEdited.value.type === "--> Add new type") {
      workoutEdited.value.type = newType.value;
    }
    emit("submit-workout", workoutEdited.value);
  }
};
const resetForm = () => {
    formRef.value.reset();
};
</script>
