<template>
  <v-dialog v-model="tabataSettings" activator="parent">
    <v-card>
      <v-card-title> Tabata Settings </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col>
              <v-text-field
                v-model="tabata.prepareTime"
                type="number"
                :rules="[(v) => v >= 0 || 'Must be >= 0']"
                label="Get ready"
                required
                hide-details
                suffix="s"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="tabata.restBetweenSets"
                type="number"
                :rules="[(v) => v >= 0 || 'Must be >= 0']"
                label="Rest between sets"
                required
                hide-details
                suffix="s"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="tabata.workTime"
                type="number"
                :rules="[(v) => v >= 0 || 'Must be >= 0']"
                label="Work"
                required
                hide-details
                suffix="s"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="tabata.restTime"
                type="number"
                :rules="[(v) => v >= 0 || 'Must be >= 0']"
                label="Rest"
                required
                hide-details
                suffix="s"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="tabata.cycles"
                type="number"
                :rules="[(v) => v >= 0 || 'Must be >= 0']"
                label="Cycles"
                required
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="tabata.sets"
                type="number"
                :rules="[(v) => v >= 0 || 'Must be >= 0']"
                label="Sets"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="returnTabata()"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useStoreTimer } from "@/stores/storeTimer";

const storeTimer = useStoreTimer();
const tabata = ref({ ...storeTimer.tabata });
const emit = defineEmits(["update-times"]);

const tabataSettings = ref(false);

const returnTabata = () => {
  storeTimer.updateTabata(tabata.value);
  emit("update-times");
  tabataSettings.value = false;
};
</script>

<style scoped>
.v-card-title {
  margin-top: 10px;
}
</style>
