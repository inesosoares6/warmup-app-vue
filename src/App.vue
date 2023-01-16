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
import { useStoreUser } from "@/stores/storeUser";
import { useStoreApp } from "@/stores/storeApp";

const storeApp = useStoreApp();
const storeWorkouts = useStoreWorkouts();
const storeUser = useStoreUser();
// const theme = ref(useTheme());

onMounted(() => {
  storeApp.init();
  storeWorkouts.init();
  storeUser.init();
  // theme.value.global.name = storeWorkouts.themeString;
});
</script>
