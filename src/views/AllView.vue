<template>
  <v-container>
    <ListWorkouts
      v-if="!storeApp.groupByType"
      :list="storeWorkouts.allWorkouts"
    />

    <ListByTypes v-else />

    <NotificationToast
      v-if="snackbar"
      :timeout="2000"
      :text="'Add workouts'"
      @close="snackbar = false"
    ></NotificationToast>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ListWorkouts from "@/components/AllView/ListWorkouts.vue";
import ListByTypes from "@/components/AllView/ListByTypes.vue";
import NotificationToast from "@/components/shared/NotificationToast.vue";
import { useStoreWorkouts } from "@/stores/storeWorkouts";
import { useStoreApp } from "@/stores/storeApp";

const storeApp = useStoreApp();
const storeWorkouts = useStoreWorkouts();

const snackbar = ref(false);

onMounted(() => {
  snackbar.value = Object.keys(storeWorkouts.allWorkouts).length < 1;
});
</script>
