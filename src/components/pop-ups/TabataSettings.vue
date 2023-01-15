<template>
  <v-dialog v-model="tabataSettings" activator="parent">
    <v-card>
      <v-card-title> Tabata Settings </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="prepareTime"
            type="number"
            :rules="[(v) => v >= 0 || 'Time must be greater than 0']"
            label="Prepare (sec)"
            required
            hide-details
          ></v-text-field>
          <v-row>
            <v-col>
              <v-text-field
                v-model="workTime"
                type="number"
                :rules="[(v) => v >= 0 || 'Time must be greater than 0']"
                label="Work (sec)"
                required
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="rest"
                type="number"
                :rules="[(v) => v >= 0 || 'Time must be greater than 0']"
                label="Rest (sec)"
                required
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="cycles"
                type="number"
                :rules="[(v) => v >= 0 || 'Time must be greater than 0']"
                label="Cycles"
                required
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="sets"
                type="number"
                :rules="[(v) => v >= 0 || 'Time must be greater than 0']"
                label="Sets"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-text-field
            v-model="restBetweenSets"
            type="number"
            :rules="[(v) => v >= 0 || 'Time must be greater than 0']"
            label="Rest between sets (sec)"
            required
            hide-details
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="returnTabata()"> Go </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["created-tabata"]);

const tabataSettings = ref(false);
const prepareTime = ref(5);
const workTime = ref(10);
const rest = ref(0);
const cycles = ref(1);
const sets = ref(1);
const restBetweenSets = ref(0);

const returnTabata = () => {
  emit("created-tabata", {
    prepareTime: prepareTime.value,
    workTime: workTime.value,
    rest: rest.value,
    cycles: cycles.value,
    sets: sets.value,
    restBetweenSets: restBetweenSets.value,
  });
  tabataSettings.value = false;
};
</script>

<style scoped>
.v-card-title {
  margin-top: 10px;
}
</style>
