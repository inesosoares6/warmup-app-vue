<template>
  <v-app>
    <BottomToolbar></BottomToolbar>
    <TopToolbar></TopToolbar>
    <v-main>
      <router-view v-slot="{ Component, route }">
        <component
          :is="Component"
          :key="route.path"
        />
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted } from "vue";
import TopToolbar from "./components/TopToolbar.vue";
import BottomToolbar from "./components/BottomToolbar.vue";
// import { useTheme } from "vuetify";
import { useStoreWorkouts } from "@/stores/storeWorkouts";

const storeWorkouts = useStoreWorkouts();
// const theme = ref(useTheme());

onMounted(() => {
  storeWorkouts.init();
  // theme.value.global.name = storeWorkouts.themeString;
});
</script>
