<template>
  <v-dialog v-model="qrcodeGenerator" activator="parent">
    <v-card>
      <v-card-title> Workouts </v-card-title>
      <v-card-subtitle
        >Read QR Code with another device to import</v-card-subtitle
      >
      <v-card-text class="d-flex justify-center">
        <div class="border">
          <VueQRCodeComponent
            class="qrcode"
            :text="message"
            :size="200"
          ></VueQRCodeComponent>
        </div>
      </v-card-text>
      <v-card-text>{{ message }}</v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";
import VueQRCodeComponent from "vue-qrcode-component";

export default defineComponent({
  name: "QrcodeGenerator",
  props: ["message"],

  components: {
    VueQRCodeComponent,
  },

  data() {
    return {
      qrcodeGenerator: false,
      size: 200,
    };
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
