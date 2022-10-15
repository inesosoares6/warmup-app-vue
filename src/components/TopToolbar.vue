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

<script>
import { defineComponent } from "vue";
import SettingsMenu from "./pop-ups/SettingsMenu.vue";
import AddWorkout from "./pop-ups/AddWorkout.vue";

export default defineComponent({
  name: "TopToolbar",

  components: {
    SettingsMenu,
    AddWorkout,
  },

  data() {
    return {
      showMenu: false,
    };
  },

  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    doNothing() {},
  },
});
</script>

<style scoped></style>
