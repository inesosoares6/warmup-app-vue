<template>
  <v-dialog v-model="settingsMenu" activator="parent">
    <v-card>
      <v-card-title> Settings </v-card-title>
      <v-card-text>
        <v-switch
          v-model="isDarkMode"
          label="Dark Mode"
          color="secondary"
          inset
          hide-details
          @change="toggleTheme"
        ></v-switch>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="deleteCache"> Delete Cache </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { useTheme } from "vuetify";

export default defineComponent({
  name: "SettingsMenu",

  setup() {
    const theme = useTheme();

    return {
      theme,
      toggleTheme: () =>
        (theme.global.name.value = theme.global.current.value.dark
          ? "light"
          : "dark"),
    };
  },

  data() {
    return {
      settingsMenu: false,
      isDarkMode: true,
    };
  },

  methods: {
    deleteCache() {
      this.$emit("delete-cache");
      this.settingsMenu = false;
    },
  },
});
</script>
