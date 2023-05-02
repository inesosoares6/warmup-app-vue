<template>
  <v-card title="Exchange Workouts">
    <template v-slot:prepend>
      <v-icon class="title-icon" color="secondary">mdi-swap-horizontal</v-icon>
    </template>

    <v-card-text>
      <v-row>
        <v-col class="d-flex justify-center">
          <v-btn variant="outlined" append-icon="mdi-arrow-top-right">
            Send
            <PreviewList
              v-if="Object.keys(allWorkouts).length > 0"
              :workouts="allWorkouts"
              action="export"
              @downloaded-workouts="downloadedWorkouts"
            ></PreviewList>
          </v-btn>
        </v-col>
        <v-col class="d-flex justify-center">
          <v-btn variant="outlined" prepend-icon="mdi-arrow-bottom-left">
            Receive
            <FileReader
              @preview-imported-workouts="previewImportedWorkouts"
            />
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <PreviewList
    v-model="imported"
    v-if="imported && importedWorkouts.length"
    :workouts="importedWorkouts"
    action="import"
  />
</template>

<script setup>
import { ref, computed } from "vue";
import FileReader from "@/components/HomeView/pop-ups/FileReader.vue";
import PreviewList from "@/components/HomeView/pop-ups/PreviewList.vue";
import { useStoreWorkouts } from "@/stores/storeWorkouts";

const storeWorkouts = useStoreWorkouts();
const importedWorkouts = ref({});
const imported = ref(false);

const allWorkouts = computed(() => {
  return storeWorkouts.allWorkouts;
});

const emit = defineEmits(["show-snackbar"]);

const downloadedWorkouts = (fileName) => {
  if (fileName !== "") {
    emit("show-snackbar", {
      color: "secondary",
      text: fileName + " exported to Documents folder.",
    });
  }
};

const previewImportedWorkouts = (workouts) => {
  importedWorkouts.value = JSON.parse(workouts);
  imported.value = true;
};
</script>
