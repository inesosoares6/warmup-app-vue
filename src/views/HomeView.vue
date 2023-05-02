<template>
  <v-container>
    <SummaryCard />

    <v-divider thickness="0px" />

    <GenerateRandomCard @show-snackbar="showSnackbar" />

    <v-divider thickness="0px" />

    <WeekOverviewCard />

    <v-divider thickness="0px" />

    <ExchangeCard @show-snackbar="showSnackbar" />

    <NotificationToast
      v-if="snackbar"
      :timeout="2000"
      :text="text"
      @close="snackbar = false"
    ></NotificationToast>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import SummaryCard from "@/components/HomeView/SummaryCard.vue";
import GenerateRandomCard from "@/components/HomeView/GenerateRandomCard.vue";
import WeekOverviewCard from "@/components/HomeView/WeekOverviewCard.vue";
import ExchangeCard from "@/components/HomeView/ExchangeCard.vue";
import NotificationToast from "@/components/shared/NotificationToast.vue";

const snackbar = ref(false);
const text = ref("");

const showSnackbar = (payload) => {
  snackbar.value = true;
  text.value = payload;
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
