<template>
  <div>
    <v-app-bar app fixed dark color="primary">
      <v-toolbar-title>Workouts App</v-toolbar-title>
      <!-- <v-btn icon>
        <v-icon>mdi-medal</v-icon>
      </v-btn> -->
      <v-btn icon>
        <v-icon>mdi-cog</v-icon>
        <SettingsMenu v-on:toggle-theme="toggleTheme"></SettingsMenu>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script setup>
import SettingsMenu from "@/components/pop-ups/SettingsMenu.vue";

const emit = defineEmits(["toggle-theme"]);

const toggleTheme = (theme) => {
  emit("toggle-theme", theme);
};
</script>

<style scoped></style>
