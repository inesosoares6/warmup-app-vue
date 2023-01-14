<template>
  <div>
    <v-app-bar app fixed dark color="primary">
      <v-toolbar-title>WOD App</v-toolbar-title>
      <v-btn>
        <v-icon>mdi-plus</v-icon>
        <AddWorkout></AddWorkout>
      </v-btn>
      <v-btn>
        <v-icon>mdi-cog</v-icon>
        <SettingsMenu></SettingsMenu>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script setup>
import SettingsMenu from "./pop-ups/SettingsMenu.vue";
import AddWorkout from "./pop-ups/AddWorkout.vue";
</script>

<style scoped></style>
