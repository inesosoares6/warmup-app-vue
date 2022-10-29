<template>
  <v-dialog v-model="qrcodeGenerator" activator="parent">
    <v-card>
      <v-card-title>
        Workouts
        <v-btn-toggle border>
          <v-btn drpressed :active="!file" @click="file = false">
            QR Code
          </v-btn>
          <v-btn drpressed :active="file" @click="file = true"> File </v-btn>
        </v-btn-toggle>
      </v-card-title>
      <div v-if="!file">
        <v-card-subtitle>Read QR Code with another device</v-card-subtitle>
        <v-card-text class="d-flex justify-center">
          <div class="border">
            <VueQRCodeComponent
              class="qrcode"
              :text="JSON.stringify(workoutList)"
              :size="200"
            ></VueQRCodeComponent>
          </div>
        </v-card-text>
      </div>
      <div v-else>
        <v-card-subtitle>Download and import in another device</v-card-subtitle>
        <v-card-text class="d-flex justify-center">
          <v-text-field
            v-model="name"
            :rules="[(v) => !!v || 'Field is required']"
            label="File name"
            required
            hide-details
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer
          ><v-btn
            :disabled="name.length === 0"
            color="secondary"
            @click="downloadFile"
          >
            Download
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";
import VueQRCodeComponent from "vue-qrcode-component";

export default defineComponent({
  name: "QrcodeGenerator",
  props: ["workoutList"],

  components: {
    VueQRCodeComponent,
  },

  data() {
    return {
      qrcodeGenerator: false,
      size: 200,
      file: false,
      name: "",
    };
  },

  created() {
    this.file = this.workoutList.length > 1;
  },

  methods: {
    downloadFile() {
      const blob = new Blob([JSON.stringify(this.workoutList, null, 4)], {
        type: "application/json",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = this.name + ".json";
      link.click();
      URL.revokeObjectURL(link.href);
      this.qrcodeGenerator = false;
    },
  },
});
</script>

<style>
.border {
  flex: center;
  width: 240px;
  background-color: white;
}

.qrcode {
  padding: 20px 20px 20px 20px;
}
</style>
