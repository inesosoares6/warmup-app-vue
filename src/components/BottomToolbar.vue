<template>
  <v-bottom-navigation app fixed grow v-model="activeItem" color="primary">
    <v-btn value="home" :to="{ path: '/' }">
      <v-icon>mdi-home</v-icon>
      Home
    </v-btn>

    <v-btn value="wod" :to="{ name: 'workout-view' }">
      <v-icon>mdi-dumbbell</v-icon>
      WOD
    </v-btn>

    <v-btn value="all" :to="{ name: 'all-view' }">
      <v-icon>mdi-format-list-bulleted</v-icon>
      All
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "BottomToolbar",

  data() {
    return {
      activeItem: "home",
    };
  },
});
</script>

<style scoped>
.v-icon {
  font-size: 16px;
  margin-bottom: 5px;
}
</style>
