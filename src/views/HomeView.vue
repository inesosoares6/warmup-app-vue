<template>
  <v-container>
    <SummaryCard />

    <v-divider thickness="0px"></v-divider>

    <GenerateRandomCard @show-snackbar="showSnackbar" />

    <v-divider thickness="0px"></v-divider>

    <WeekOverviewCard />

    <v-divider thickness="0px"></v-divider>

    <ExchangeCard @show-snackbar="showSnackbar" />

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
      <template v-slot:actions>
        <v-btn :color="color" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import SummaryCard from "@/components/HomeView/SummaryCard.vue";
import GenerateRandomCard from "@/components/HomeView/GenerateRandomCard.vue";
import WeekOverviewCard from "@/components/HomeView/WeekOverviewCard.vue";
import ExchangeCard from "@/components/HomeView/ExchangeCard.vue";

const snackbar = ref(false);
const color = ref("");
const text = ref("");
const timeout = ref(2000);

const showSnackbar = (payload) => {
  snackbar.value = true;
  color.value = payload.color;
  text.value = payload.text;
};
</script>

<style>
.v-divider {
  margin-top: 5px;
  margin-bottom: 5px;
}

.title-icon {
  font-size: 23px;
}
</style>
