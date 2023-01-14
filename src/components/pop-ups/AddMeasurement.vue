<template>
  <v-dialog v-model="addMeasurement" activator="parent">
    <v-card>
      <v-card-title> Add Measurement </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col>
              <v-select
                v-model="name"
                :items="getTypes()"
                :rules="[(v) => !!v || 'Item is required']"
                label="Type"
                required
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="unitRecord"
                :items="getItems()"
                :rules="[(v) => !!v || 'Item is required']"
                label="Unit"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-if="unitRecord !== ''"
                v-model="valueRecord"
                :rules="[(v) => !!v || 'Field is required']"
                label="Value"
                type="number"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-if="name === 'Weight' && unitRecord !== ''"
                v-model="targetValue"
                :rules="[(v) => !!v || 'Field is required']"
                label="Target"
                suffix="kg"
                type="number"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="addRecord"> Add </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useStoreWorkouts } from "@/stores/storeWorkouts";

const storeWorkouts = useStoreWorkouts();

const addMeasurement = ref(false);
const name = ref("");
const valueRecord = ref("");
const unitRecord = ref("");
const targetValue = ref("");

const addRecord = () => {
  let date = new Date().toString().split(" ");
  storeWorkouts.addMeasurement({
    id: uuidv4(),
    name: name.value,
    value: [valueRecord.value],
    unit: unitRecord.value,
    target: targetValue.value,
    date: [date[2] + " " + date[1] + " " + date[3]],
  });
  name.value = "";
  valueRecord.value = "";
  unitRecord.value = "";
  targetValue.value = "";
  addMeasurement.value = false;
};

const getItems = () => {
  if (name.value === "Weight") {
    unitRecord.value = "kg";
    return ["kg"];
  } else {
    return ["%", "kg"];
  }
};

const getTypes = () => {
  let types = ["Weight", "Body Fat", "Muscle Mass"];
  if (storeWorkouts.measurements.length === 0) return types;
  storeWorkouts.measurements.forEach((record) => {
    const index = types.indexOf(record.name);
    if (index > -1) {
      types.splice(index, 1);
    }
  });
  return types;
};
</script>

<style scoped>
.v-card-title {
  margin-top: 10px;
}

.v-text-field :deep(input::-webkit-outer-spin-button),
.v-text-field :deep(input::-webkit-inner-spin-button) {
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
}
</style>
