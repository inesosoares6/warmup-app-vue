<template>
  <v-dialog v-model="qrcodeReader" activator="parent">
    <v-card class="mb">
      <v-card-title>
        Importing
        <v-btn-toggle border>
          <v-btn drpressed :active="!showCamera" @click="showCamera = false">
            File
          </v-btn>
          <v-btn drpressed :active="showCamera" @click="showCamera = true">
            Camera
          </v-btn>
        </v-btn-toggle>
      </v-card-title>
      <div v-if="!showCamera">
        <v-card-subtitle>Select the workouts file</v-card-subtitle>
        <v-card-text>
          <v-file-input
            type="file"
            label="Import workouts"
            accept=".json"
            @change="importFile"
            hide-details
          />
        </v-card-text>
      </div>
      <div v-else>
        <v-card-subtitle
          >Point your camera to the workouts' QR Code</v-card-subtitle
        >
        <v-card-text class="center stream">
          <qr-stream @decode="openPreviewList" class="mb">
            <div style="color: red" class="frame"></div>
          </qr-stream>
        </v-card-text>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import { QrStream } from "vue3-qr-reader";

const emit = defineEmits(["preview-imported-workouts"]);

const qrcodeReader = ref(false);
const showCamera = ref(false);

const openPreviewList = (list) => {
  emit("preview-imported-workouts", list);
  qrcodeReader.value = false;
};

const importFile = (event) => {
  const file = event.target.files[0];
  var reader = new FileReader();
  reader.addEventListener("load", () => {
    openPreviewList(reader.result);
  });
  reader.readAsText(file);
};
</script>

<style scoped>
.stream {
  max-height: 500px;
  max-width: 500px;
  margin: auto;
}
.frame {
  border-style: solid;
  border-width: 2px;
  border-color: red;
  height: 200px;
  width: 200px;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  margin: auto;
}
</style>
