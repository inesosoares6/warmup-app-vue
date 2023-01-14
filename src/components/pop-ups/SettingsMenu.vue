<template>
  <v-dialog v-model="settingsMenu" activator="parent">
    <v-card>
      <v-card-title> Settings </v-card-title>
      <v-card-text>
        <v-switch
          v-model="isDarkMode"
          label="Dark mode"
          color="secondary"
          inset
          hide-details
          @change="toggleTheme"
        ></v-switch>
        <v-switch
          v-model="groupByTypeEnabled"
          label="Group workouts by type"
          color="secondary"
          inset
          hide-details
          @change="groupByTypeFunction"
        ></v-switch>

        <v-divider />

        <h3>Delete</h3>
        <v-row>
          <v-col class="d-flex justify-center">
            <v-btn variant="outlined" color="error">
              WODs
              <PreviewList
                v-if="store.allWorkouts.length > 0"
                v-bind:workouts="store.allWorkouts"
                v-bind:action="'delete'"
              ></PreviewList>
            </v-btn>
          </v-col>
          <v-col class="d-flex justify-center">
            <v-btn variant="outlined" color="error">
              PR
              <PreviewRecords
                v-if="store.personalRecords.length > 0"
                v-bind:personalRecords="store.personalRecords"
                v-bind:action="'records'"
              ></PreviewRecords>
            </v-btn>
          </v-col>
          <v-col class="d-flex justify-center">
            <v-btn variant="outlined" color="error">
              Measurements
              <PreviewRecords
                v-if="store.measurements.length > 0"
                v-bind:personalRecords="store.measurements"
                v-bind:action="'measurements'"
              ></PreviewRecords>
            </v-btn>
          </v-col>
          <v-col class="d-flex justify-center">
            <v-btn variant="outlined" color="error" @click="deleteCache">
              All Cache
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions> </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";
import PreviewList from "@/components/pop-ups/PreviewList.vue";
import PreviewRecords from "@/components/pop-ups/PreviewRecords.vue";
import { useStoreWorkouts } from '@/stores/storeWorkouts';

export default defineComponent({
  name: "SettingsMenu",

  components: {
    PreviewList,
    PreviewRecords,
  },

  setup() {
    const store = useStoreWorkouts()
    return {
      store,
    }
  },

  updated() {
    this.groupByTypeEnabled = this.store.groupByType;
  },

  mounted() {
    this.isDarkMode = this.theme === 'dark';
  },

  data() {
    return {
      settingsMenu: false,
      isDarkMode: true,
      groupByTypeEnabled: false,
    };
  },

  methods: {
    deleteCache() {
      this.store.deleteCache();
      this.settingsMenu = false;
    },

    deletePRs(records) {
      this.store.deletePRs(records);
      this.settingsMenu = false;
    },

    deleteMeasurements(records) {
      this.store.deleteMeasurements(records);
      this.settingsMenu = false;
    },

    deleteWorkouts(workoutList) {
      this.store.deleteWorkouts(workoutList);
      this.settingsMenu = false;
    },

    groupByTypeFunction() {
      this.store.groupByTypeFunction(this.groupByTypeEnabled);
    },

    toggleTheme() {
      this.store.toggleTheme();
    },
  },
});
</script>

<style>
.v-divider {
  margin-top: 10px;
  margin-bottom: 10px;
}

.v-row {
  margin-top: 10px;
}
</style>
