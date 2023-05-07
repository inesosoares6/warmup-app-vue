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
        <v-row v-if="!showNewType && types.length">
          <v-col cols="10">
            <v-select
              v-model="workoutEdited.type"
              :items="types"
              :rules="[(v) => !!v || 'Required']"
              label="Type"
              required
              hide-details
              style="margin-bottom: 10px"
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-btn icon flat @click="showNewType = true">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-text-field
          v-else
          v-model="newType"
          :rules="[(v) => !!v || 'Required']"
          label="Type"
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
                (v) => v != null || 'Required',
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
      <v-btn
        color="secondary"
        :disabled="checkFormValid()"
        @click="submitWorkout"
      >
        {{ buttonText }}
      </v-btn>
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
const showNewType = ref(false);

const types = computed(() => {
  return storeWorkouts.getTypes;
});

onMounted(() => {
  workoutEdited.value = { ...props.workout };
});

const submitWorkout = () => {
  formRef.value.validate();
  if (valid.value) {
    workoutEdited.value.type = showNewType.value
      ? newType.value
      : workoutEdited.value.type;
    emit("submit-workout", workoutEdited.value);
  }
};

const checkFormValid = () => {
  return !(
    workoutEdited.value.name &&
    (workoutEdited.value.type || newType.value) &&
    workoutEdited.value.time &&
    workoutEdited.value.completions &&
    workoutEdited.value.exercises
  );
};

const resetForm = () => {
  formRef.value.reset();
};
</script>

<style scoped>
.v-text-field :deep(input::-webkit-outer-spin-button),
.v-text-field :deep(input::-webkit-inner-spin-button) {
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
}
</style>
