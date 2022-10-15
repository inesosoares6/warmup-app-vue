<template>
  <v-dialog activator="parent">
    <v-card>
      <v-card-title> Settings </v-card-title>
      <v-card-text>
        <v-switch
          v-model="isDarkMode"
          label="Dark Mode"
          color="secondary"
          inset
          hide-details
          @change="setDarkMode"
        ></v-switch>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "SettingsMenu",

  data() {
    return {
        isDarkMode: false,
    };
  },

  methods: {
    setDarkMode() {
        //TODO set dark mode
    }
  }
});
</script>
