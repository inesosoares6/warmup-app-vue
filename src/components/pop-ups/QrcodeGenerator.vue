<template>
  <v-dialog v-model="qrcodeGenerator" activator="parent">
    <v-card>
      <v-card-title> QR Code </v-card-title>
      <v-card-text class="d-flex justify-center">
        <VueQRCodeComponent :text="message" :size="200"></VueQRCodeComponent>
      </v-card-text>
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
    };
  },

  methods: {},
});
</script>
