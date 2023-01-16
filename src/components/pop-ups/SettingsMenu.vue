<template>
  <v-dialog v-model="settingsMenu" activator="parent">
    <v-card>
      <v-card-title> Settings </v-card-title>
      <v-card-text>
        <v-switch
          v-model="isDarkMode"
          label="Dark mode"
          color="secondary"
          inset
          hide-details
          @change="toggleTheme"
        ></v-switch>
        <v-switch
          v-model="groupByTypeEnabled"
          label="Group workouts by type"
          color="secondary"
          inset
          hide-details
          @change="groupByTypeFunction"
        ></v-switch>

        <v-divider style="margin-bottom: 20px;"/>

        <v-btn variant="outlined" color="error" @click="deleteCache">
          Delete All Cache
        </v-btn>
      </v-card-text>
      <v-card-actions> </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onUpdated } from "vue";
import { useStoreApp } from "@/stores/storeApp";

const storeApp = useStoreApp();

const settingsMenu = ref(false);
const isDarkMode = ref(true);
const groupByTypeEnabled = ref(false);

// onMounted(() => {
//   isDarkMode.value = this.theme === 'dark';
// });

onUpdated(() => {
  groupByTypeEnabled.value = storeApp.groupByType;
});

const deleteCache = () => {
  console.log('TODO: delete all cache');
  settingsMenu.value = false;
};

const groupByTypeFunction = () => {
  storeApp.groupByTypeFunction(groupByTypeEnabled.value);
};

const toggleTheme = () => {
  storeApp.toggleTheme();
};
</script>

<style>
.v-divider {
  margin-top: 10px;
  margin-bottom: 10px;
}

.v-row {
  margin-top: 10px;
}
</style>
