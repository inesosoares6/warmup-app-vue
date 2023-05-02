<template>
  <v-container>
    <SummaryCard />
    <v-divider thickness="0px"></v-divider>
    <GenerateRandomCard @show-snackbar="showSnackbar"/>
    <v-divider thickness="0px"></v-divider>
    <WeekOverviewCard/>
    
    <v-divider thickness="0px"></v-divider>
    <v-card>
      <v-card-title>
        <v-icon color="secondary">mdi-swap-horizontal</v-icon>
        Exchange WODs
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="d-flex justify-center">
            <v-btn variant="outlined" append-icon="mdi-arrow-top-right">
              Send
              <PreviewList
                v-if="Object.keys(storeWorkouts.allWorkouts).length > 0"
                v-bind:workouts="Object.values(storeWorkouts.allWorkouts)"
                v-bind:action="'export'"
                v-on:downloaded-workouts="downloadedWorkouts"
              ></PreviewList>
            </v-btn>
          </v-col>
          <v-col class="d-flex justify-center">
            <v-btn variant="outlined" prepend-icon="mdi-arrow-bottom-left">
              Receive
              <QrcodeReader
                v-on:preview-imported-workouts="previewImportedWorkouts"
              />
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    

    <PreviewList
      v-model="imported"
      v-if="imported && importedWorkouts.length > 0"
      v-bind:workouts="importedWorkouts"
      v-bind:action="'import'"
    />

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
      <template v-slot:actions>
        <v-btn :color="color" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import SummaryCard from "@/components/HomeView/SummaryCard.vue";
import GenerateRandomCard from "@/components/HomeView/GenerateRandomCard.vue";
import WeekOverviewCard from "@/components/HomeView/WeekOverviewCard.vue";
import PreviewList from "@/components/pop-ups/PreviewList.vue";
import QrcodeReader from "@/components/pop-ups/QrcodeReader.vue";
import { useStoreWorkouts } from "@/stores/storeWorkouts";

const storeWorkouts = useStoreWorkouts();

const importedWorkouts = ref([]);
const imported = ref(false);
const snackbar = ref(false);
const color = ref("");
const text = ref("");
const timeout = ref(2000);

const showSnackbar = (payload) => {
  snackbar.value = true;
  color.value = payload.color;
  text.value = payload.text;
}

const downloadedWorkouts = (fileName) => {
  if (fileName !== "") {
    text.value = fileName + " exported to Documents folder.";
    snackbar.value = true;
    color.value = "secondary";
  }
};

const previewImportedWorkouts = (workouts) => {
  importedWorkouts.value = JSON.parse(workouts);
  imported.value = true;
};
</script>

<style>

.v-divider {
  margin-top: 5px;
  margin-bottom: 5px;
}

.title-icon {
  font-size: 23px;
}
</style>
