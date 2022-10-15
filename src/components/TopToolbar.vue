<template>
  <div>
    <v-app-bar app fixed dark color="primary">
      <v-toolbar-title>WOD App</v-toolbar-title>
      <v-icon>mdi-cog</v-icon>
      <v-icon>mdi-logout</v-icon>

    </v-app-bar>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TopToolbar",

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

<style scoped>
.v-icon {
    margin-right: 13px;
}
</style>