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
        <v-card-subtitle
          >Select the QR Code image of the workouts</v-card-subtitle
        >
        <v-card-text>
          <qr-capture @decode="onDecode" class="mb"></qr-capture>
        </v-card-text>
      </div>
      <div v-else>
        <v-card-subtitle
          >Point your camera to the workouts' QR Code</v-card-subtitle
        >
        <v-card-text class="center stream">
          <qr-stream @decode="onDecode" class="mb">
            <div style="color: red" class="frame"></div>
          </qr-stream>
        </v-card-text>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent} from "vue";
import { QrStream, QrCapture } from "vue3-qr-reader";

export default defineComponent({
  name: "QrcodeReader",
  props: ["message"],

  components: {
    QrStream,
    QrCapture,
  },

  data() {
    return {
      qrcodeReader: false,
      showCamera: false,
    };
  },

  methods: {
    onDecode(data) {
      this.$emit("preview-imported-workouts", data);
      this.qrcodeReader = false;
    }
  },
});
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
