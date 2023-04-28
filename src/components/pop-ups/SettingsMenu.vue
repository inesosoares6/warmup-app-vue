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
      </v-card-text>
      <v-card-actions> </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, onUpdated } from "vue";
import { useStoreApp } from "@/stores/storeApp";
import { useTheme } from "vuetify";

const storeApp = useStoreApp();

const settingsMenu = ref(false);
const isDarkMode = ref(true);
const groupByTypeEnabled = ref(false);
const theme = ref(useTheme());

const emit = defineEmits(["toggle-theme"]);

onMounted(() => {
  isDarkMode.value = theme.value.global.name === "dark";
});

onUpdated(() => {
  groupByTypeEnabled.value = storeApp.groupByType;
});

const groupByTypeFunction = () => {
  storeApp.groupByTypeFunction(groupByTypeEnabled.value);
};

const toggleTheme = () => {
  emit("toggle-theme", isDarkMode.value ? "dark" : "light");
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
